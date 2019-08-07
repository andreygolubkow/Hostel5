<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Hostel</span>
        <span class="font-weight-light">Office</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            v-on="on"
          >
            <span class="mr-2">Меню</span>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/office/peoples">
            <v-list-item-title>Контингент</v-list-item-title>
          </v-list-item>
          <v-list-item to="/office/tasks">
            <v-list-item-title>Задачи</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        text
      >
        <span class="mr-2">Аккаунт</span>
      </v-btn>

    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

    export default {
        name: 'Office',
        data: () => ({
            //
        }),
    };
</script>
