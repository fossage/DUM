   
   // @BIGTODO: Finish porting this from my Angular implementation

   function StateManagerFactory() {
    /**
     * @namespace StateManagerService
     */
      
      var service                 = {};
      var staleAfter              = 10000000;
      var resourceInfoStore       = {};
      var processingRequestsStore = {};

      /*========== METHOD/PROPS ASSIGNMENT ==========*/
      Object.assign(service, {
        get: get,
        put: put,
        post: post,
        delete: del,
        patch: patch,
        trigger: trigger,
        subscribeTo: subscibeTo,
        getLocalResource: getLocalResource,
        patchLocalResource: patchLocalResource,
        updateLocalResource: updateLocalResource
      });

      init();

      /*========================================
                  METHOD DEFINITIONS
      =========================================*/
      /**
      * @function patchLocalResource
      * @memberof StateManagerService
      * @param {string} resourceName - The name of the object in the store
      * @param {object} urlParams - An object containing the params to replace the dynamic portions
      * or the url model.
      * @param {object} updatedResource - The updated version of a give resource.
      * @description Used for updating resources that have a corresponding resource on the back end,
      * but are not yet ready to be posted to the backend for update(i.e. a resource that has been created
      * but is in the middle of a creation or update flow).
      */
      function patchLocalResource(resourceName, urlParams, updatedResource) {
        var lruId = _assembleUrl(_getResourceInfo(resourceName).url, urlParams);
        LRU.remove(lruId);
        var eventName = resourceName + 'Updated';
        $rootScope.$broadcast(eventName, updatedResource);
        return updatedResource;
      }

      /**
      * @function updateLocalResource
      * @memberof StateManagerService
      * @param {string} resourceName - The name of the object in the store
      * @param {string | number | object | array} newData - The data to be stored in memory.
      * @param {number} [staleTime] - A time in milliseconds after which the data will be removed from memory.
      * @description Updates an object that is a local resource only, meaning it either doesn't have a
      * corresponding resouce on the backend or it does have a corresponding backend resource but is not
      * ready to be updated on the backend yet, i.e. a resource in the midst of an update or create flow.
      */
      function updateLocalResource(resourceName, newData, staleTime) {
        var localResource = _getResourceInfo(resourceName);
        if (!localResource) {
          localResource = resourceInfoStore[resourceName] = {};
          localResource.data = newData;
        }

        if (staleTime) {
          $timeout(function() {
            delete resourceInfoStore[resourceName].data;
          }, staleTime);
        }

        localResource.data = newData;
        $rootScope.$broadcast(resourceName + 'Updated', localResource.data);
        return localResource.data;
      }
      
      /**
      * @function subscribeTo
      * @param {array} subscriptionList - A list of objects with the property of 'name' and optionally,
      * 'handler'.  'name' specifies which resource the controller would like to be notified about on
      * update and 'handler' is the handler funtion to be called after the resource is updated.
      * @param {object} scope - The $scope object from the subscribing controller
      * @param {object} [ctrlThis] - The controller's 'this' reference when using 'controllerAs' syntax
      * @param {array} [deregisterLocalsList] - A list of local resources that should be destroyed when
      * the subscribed controller is destroyed
      * @memberof StateManagerService
      * @description Registers a controller's $scope to be notified on updates of the given resouce(s).
      * On update the 'handler' function will be called. If 'handler' is ommited the controller will
      * automatically have a property set on its $scope or ctrlThis with the name of the resource set to update when
      * the resource updates.
      * @public
      */
      function subscibeTo(subsciptionList, scope, ctrlThis, deregisterLocalsList) {
        if (!scope) {
          throw new Error('Missing $scope argument');
        }

        subsciptionList.forEach((subscriptionDetails) => {
          if (!subscriptionDetails.handler) {
            subscriptionDetails.handler = (e, data) => {
              if (!data) {
                Logger.error(subscriptionDetails.name + 'Updated event does not return data. Please provide a handler function so StateManager knows what to do when the event fires.');
              }

              if (ctrlThis) {
                ctrlThis[subscriptionDetails.name] = data;
              } else {
                scope[subscriptionDetails.name] = data;
              }
            };
          }

          var deregisterScope = scope.$on(subscriptionDetails.name + 'Updated', function(e, newData) {
            subscriptionDetails.handler(e, newData);
          });
          
          scope.$on('$destroy', function() {
            if (deregisterLocalsList) {
              deregisterLocalsList.forEach((objName) => {
                _deregisterLocalResource(objName);
              });
            }

            deregisterScope();
          });
        });
      }

      /**
      * @function trigger
      * @param {string} eventName - The name of an event to trigger in the form of '...*Updated', i.e. 'programUpdated'
      * @description Used for explicitly triggering events. This is esentially just a wrapper around $rootScope.$broadcast
      * but it adds some extra funtionality for debugging. Also, ideally all events should be handled via StateManager so
      * we have a singular place managing the event system to make the data flows easier to reason about.
      * @memberof StateManagerService
      * @public
      */
      function trigger(resourceName, data) {
        if (arguments.length < 2) {
          data = resourceInfoStore[resourceName];
        }

        $rootScope.$broadcast(resourceName + 'Updated', data);
      }

      /**
      * @function get
      * @param {object} argsObject - The name of the resource to get.
      * @param {string} argsObject.resourceName - The name of the resource in question.
      * @param {object} argsObject.urlParams - An object containing the params to replace the dynamic portions
      * or the url model, i.e { teamId:3 } -> team/:teamId -> team/3
      * @param {object} argsObject.requestParams - An object containing the request parameters to be sent to the backend
      * @param {string} argsObject.queryParams - A string to be concatenated onto the end of the generated url which
      * contains query params.
      * @param {boolean} argsObject.skipCache - A flag that can be set to let StateManager know to avoid the cache all together
      * ensuring we get a fresh resource from the api.
      * @param {object} [scope] - The $scope from the controller that is requesting the resource.
      * @description Handles all the logic involved in getting resources. Determines whether a call needs to be made to the backend
      * to get a resource or if we can get it from memory. If the skipCache flag is set to true, it will go directly to the api,
      * however if the skipCache flag is not true it will first check if the resource is in memory.  If provided with a scope argument,
      * it starts by running up the $scope chain and seeing if any ancestor controllers have the resource in question. If not, it then
      * goes to the LRU to find it. Finally, if its not there it goes to the api to get it.
      * and che
      * @memberof StateManagerService
      * @public
      * @todo - Update the query params argument to be an object like urlParams and requestParams and build a query param constructor
      * to properly assemble the string rather than have ther services or controllers do it.
      * @todo - Think about if we want to broadcast when gettting a cached resource. By broadcasting our controllers can be totally ignorant
      * of where we are getting data, but we also introduce a lot of potential chatter into the system because it may kick off event chains
      * that don't serve any purpose.
      */

      //argsObject = {resourceName: 'string', urlParams: {key: val}, requestParams {key: val}, queryParams: '?foo=bar', transformers: [transformFunc1, transformFunc2], skipCache: boolean}
      function get(options, additionalOpts) {
        var options            = _setUpOptions(options, additionalOpts);
        var d                  = $q.defer();
        var resourceInfo       = resourceInfoStore[options.resourceName];
        var url                = _assembleUrl(resourceInfo.url, options.urlParams, options.queryParams);
        var processingRequests = processingRequestsStore[url];
        var sharedResource     = options.scope ? _requestShared(options.resourceName, d, options.scope) : null;
        var cachedResource     = window.pusherOptions && window.pusherOptions.enabled ? LRU.get('/api/' + url) : null;
        var cachedData         = cachedResource ? cachedResource.data : null;

        //*=========== REQUEST ROUTING ==========*/
        if (!options.skipCache && sharedResource) {
          if (processingRequests) {
            return _aggregateRequest(processingRequests, d, 'stored resource: ' + url);
          } else {
            return d.promise;
          }
        } else if (!options.skipCache && cachedData && cachedResource.trusted) {
          d.resolve(cachedData);

          if (processingRequests) {
            return _aggregateRequest(processingRequests, d, 'stored resource: ' + url);
          }

          processingRequestsStore[url] = [];

          if (!options.noBroadcast) {
            $rootScope.$broadcast(options.resourceName + 'Updated', cachedData);
          }
          
          // Buffer to prevent unneccesary event chatter
          $timeout(function() {
            processingRequestsStore[url] = null;
          }, 50);

          return d.promise;
        } else {

          if (processingRequests) {
            return _aggregateRequest(processingRequests, d, 'api resource: ' + url);
          } else {
            processingRequestsStore[url] = [];
            return _getFromApi(resourceInfo.taskDescription, url, options, d);
          }
        }
      }

      function getLocalResource(resourceName) {
        var localResource = _getResourceInfo(resourceName);

        if (localResource) {
          return localResource.data;
        } else {
          if (window.debuggingErrors) {
            $log.warn('No local resource with the name ' + resourceName + ' has been registered');
          }

          return false;
        }
      }

      //options = {resourceName: 'string', urlParams: {key: val}, requestParams {key: val}, transformers: [transformFunc1, transformFunc2]}
      function post(options, additionalOpts) {
        return _updateHelper(options, additionalOpts, 'post');
      }

      function put(options, additionalOpts) {
        return _updateHelper(options, additionalOpts, 'put');
      }

      function patch(options, additionalOpts) {
        return _updateHelper(options, additionalOpts, 'patch');
      }

      //options, additionalOpts = {resourceName: 'string', urlParams: {key: val}, requestParams {key: val}, noBroadcast: boolean}
      function del(options, additionalOpts) {
        var options           = _setUpOptions(options, additionalOpts);
        var resourceInfo      = _getResourceInfo(options.resourceName);

        if (resourceInfo) {
          var d               = $q.defer();
          var urlModel        = resourceInfo.deleteUrl ? resourceInfo.deleteUrl : resourceInfo.url;
          var taskDescription = resourceInfo.deleteTaskDescription ? resourceInfo.deleteTaskDescription : resourceInfo.taskDescription;
          var url             = _assembleUrl(urlModel, options.urlParams);

          Api.delete(url, options.requestParams, {taskDescription: taskDescription})
          .then(function() {
            d.resolve(null);
            LRU.remove(url);

            if (!options.noBroadcast) {
              $rootScope.$broadcast(options.resourceName + 'Deleted', null);
            }
          });

          return d.promise;
        }
      }

      /*========================================
                  PRIVATE FUNCTIONS
      =========================================*/
      function _getFromApi(taskDescription, url, options, deferred) {
        var eventName = options.resourceName + 'Updated';
        return Api.get(url, options.requestParams, {taskDescription: taskDescription, resourceName: options.resourceName, transformers: options.transformers})
        .then(function(response) {
          var lruId              = url;
          var processingRequests = processingRequestsStore[url];

          if (processingRequests) {
            processingRequests.forEach((d) => {
              d.resolve(response);
            });
          }

          if (!options.noBroadcast) {
            $rootScope.$broadcast(eventName, response);
          }

          if (deferred) {
            deferred.resolve(response);
            return deferred.promise;
          }
        })
        .catch(function() {
          // clear out all the promises  where an error occured
          var processingRequests = processingRequestsStore[url];

          if (processingRequests) {
            processingRequests.forEach((d) => {
              d.reject();
            });
          }
        })
        .finally(function() {
          processingRequestsStore[url] = null;
        });
      }

      function _getResourceInfo(resourceName) {
        var resourceInfo = resourceInfoStore[resourceName];

        if (!resourceInfo) {
          Logger.warn('No object with the name ' + resourceName + ' has been registered');
          return false;
        }

        return resourceInfo;
      }

      function _requestShared(resourceName, deferred, scope) {
        if (!scope) {
          throw new ReferenceError('missing $scope argument');
        }

        var current = scope.$parent;

        while (current) {
          var resource = current.ctrlName ? current[current.ctrlName][resourceName] : current[resourceName];

          if (!_.isEmpty(resource)) {
            deferred.resolve(resource);
            return resource;
          }

          current = current.$parent;
        }

        return null;
      }

      function _deregisterLocalResource(resourceName) {
        if (_.has(resourceInfoStore, resourceName)) {
          delete resourceInfoStore[resourceName].data;
        } else {
          Logger.warn('Can\'t deregister ' + resourceName + '. No resource by that name has been registered.');
        }
      }

      function _aggregateRequest(resourceProcessingQueue, deferred, debugMessage) {
        Logger.info('Aggregating ' + debugMessage);
        resourceProcessingQueue.push(deferred);
        return deferred.promise;
      }

      function _updateHelper(options1, additionalOpts, httpMethod) {
        var options      = _setUpOptions(options1, additionalOpts);
        var resourceInfo = _getResourceInfo(options.resourceName);

        if (resourceInfo) {
          var d               = $q.defer();
          var urlModel        = resourceInfo[httpMethod + 'Url'] ? resourceInfo[httpMethod + 'Url'] : resourceInfo.url;
          var url             = _assembleUrl(urlModel, options.urlParams);
          var taskDescription = resourceInfo[httpMethod + 'TaskDescription'] ? resourceInfo[httpMethod + 'TaskDescription'] : resourceInfo.taskDescription;

          Api[httpMethod](url, options.requestParams, { taskDescription: taskDescription, transformers: options.transformers })
          .then(function(response, status) {
            d.resolve(response);

            // pop a toast notifying success, if applicable
            if (resourceInfo.successMessage) {
              toastr.success(resourceInfo.successMessage, 'Success');
            }

            if (!options.noBroadcast) {
              $rootScope.$broadcast(options.resourceName + 'Updated', response);
            }

          })
          .catch(function(e) {
            Logger.error(resourceInfo.taskDescription, e);
            d.reject(e);
          });

          return d.promise;
        }
      }

      function _setUpOptions(opts1, opts2) {
        var defaultOptions = {
          scope: null,
          urlParams: null,
          queryParams: '',
          resourceName: '',
          skipCache: false,
          transformers: null,
          noBroadcast: false,
          requestParams: null
        };
        
        return Object.assign(defaultOptions, opts1, opts2 || {});
      }

      /*========================================
                    INITIALIZATION
      =========================================*/
      function init() {
        resourceInfoStore = ResourceInfo.all();
      }

      return service;
    }
