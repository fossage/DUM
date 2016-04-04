import {DOM} from '../core/elements';
import {weatherPane} from '../components/weather-pane';
import {mainControlTiles} from '../components/main-control-tiles';
import {plexControls} from '../components/plex-controls';

/*======== COMPONENT SETUP =======*/

/*======== LINKAGE =======*/
DOM.attach(
  weatherPane,
  mainControlTiles,
  plexControls
)
.setGlobalStyles({
  backgroundColor: '#111'
});


