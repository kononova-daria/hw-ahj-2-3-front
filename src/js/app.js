import Rendering from './Rendering';
import Actions from './Actions';

const page = new Rendering();

page.bindToDOM(document.querySelector('#container'));
page.draw();

const act = new Actions(page);
act.init();
