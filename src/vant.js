import Vue from 'vue';
import {
    Icon,
    Sku,
    AddressList,
    SubmitBar,
    TabbarItem,
    Tabbar,
    NavBar,
    Sticky,
    Search,
    CellGroup,
    Cell,
    Form,
    Field,
    Button,
    Tag,
    Switch,
    Dialog,
    Notify,
    Tab, Tabs, Card,
    Swipe,
    SwipeItem,
    Divider,
    Stepper,
    GoodsAction,
    GoodsActionIcon,
    GoodsActionButton,
    DropdownMenu,
    DropdownItem
} from 'vant';


import {
    Empty
} from 'vant';
import {
    TreeSelect,
    ImagePreview
} from 'vant'
Vue.use(TreeSelect);
Vue.use(Empty);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);
Vue.use(Icon);
Vue.use(TabbarItem)
Vue.use(Tabbar)
Vue.use(Search)
Vue.use(NavBar);
Vue.use(Sticky);
Vue.use(Swipe);
Vue.use(SwipeItem);
Vue.use(Divider);
Vue.use(Stepper);
Vue.use(GoodsAction);
Vue.use(GoodsActionIcon);
Vue.use(GoodsActionButton);
Vue.use(Tab);
Vue.use(Tabs);
Vue.use(Card);
Vue.use(CellGroup);
Vue.use(Cell);
Vue.use(Tag);
Vue.use(Switch);
Vue.use(Form);
Vue.use(Field);
Vue.use(Button);
Vue.use(SubmitBar);
Vue.use(AddressList);
Vue.use(Sku);
Vue.prototype.$Dialog = Dialog;
Vue.prototype.$Notify = Notify;
