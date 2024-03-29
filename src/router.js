import Vue from "vue";
import Router from "vue-router";
import Index from "./views/Index";
import Office from "./views/Admin/Office";
import Peoples from "./views/Admin/Peoples/Peoples";
import PeoplesListView from "./views/Admin/Peoples/PeoplesListView";
import PeopleView from "./views/Admin/Peoples/PeopleView";
import PeoplesImport from "./views/Admin/Peoples/PeoplesImport";
import Rooms from "./views/Admin/Rooms/Rooms";
import RoomsListView from "./views/Admin/Rooms/RoomsListView";
import RoomView from "./views/Admin/Rooms/RoomView";
import Sanitary from "./views/Sanitary/Sanitary";
import Floor from "./views/Sanitary/Floor/Floor";
import FloorList from "./views/Sanitary/Floor/FloorList";
import FloorView from "./views/Sanitary/Floor/FloorView";
import Users from "./views/Admin/Users/Users";
import UserListView from "./views/Admin/Users/UserListView";
import UserView from "./views/Admin/Users/UserView";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "",
      component: Index
    },
    {
      path: "/admin/",
      component: Office,
      children: [
        {
          path: "index",
          component: () => import("./views/Admin/Index.vue")
        },
        {
          path: "message",
          component: () => import("./views/Admin/Message.vue")
        },
        {
          path: "peoples",
          component: Peoples,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: PeoplesListView
            },
            {
              path: "import",
              component: PeoplesImport
            },
            {
              path: ":id",
              name: "people-view",
              component: PeopleView
            }
          ]
        },
        {
          path: "users",
          component: Users,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: UserListView
            },
            {
              path: ":id",
              name: "user-view",
              component: UserView
            }
          ]
        },
        {
          path: "rooms",
          component: Rooms,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: RoomsListView
            },
            {
              path: ":id",
              name: "room-view",
              component: RoomView
            }
          ]
        },
        {
          path: "",
          redirect: "index"
        }
      ]
    },
    {
      path: "/sanitary/",
      component: Sanitary,
      children: [
        {
          path: "index",
          component: () => import("./views/Sanitary/Index.vue")
        },
        {
          path: "floor",
          component: Floor,
          children: [
            {
              path: "",
              redirect: "list"
            },
            {
              path: "list",
              component: FloorList
            },
            {
              path: ":id",
              name: "floor-view",
              component: FloorView
            }
          ]
        }
      ]
    }
  ]
});
