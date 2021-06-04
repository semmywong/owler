import OFor from './o-for';
import OIf from './o-if';
import OInclude from './o-include';
import OText from './o-text';

const tagHandler = {
    'o-for': new OFor(),
    'o-if': new OIf(),
    'o-include': new OInclude(),
    'o-text': new OText(),
};
export default tagHandler;
