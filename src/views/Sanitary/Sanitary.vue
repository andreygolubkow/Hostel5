<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>АИС Общежитие</span>
        <span class="font-weight-light">Санитария</span>
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
          <v-list-item to="/sanitary/index">
            <v-list-item-title>Обзор</v-list-item-title>
          </v-list-item>
          <v-list-item to="/sanitary/floor">
            <v-list-item-title>Этаж</v-list-item-title>
          </v-list-item>
          <v-list-item href="https://общага5.рф/api/export/sanitary" target="_blank">
            <v-list-item-title>Экспорт</v-list-item-title>
          </v-list-item>
          <v-list-item href="https://общага5.рф">
            <v-list-item-title>Аккаунт</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>

    export default {
        name: 'Sanitary',
        data: () => ({
            //
        }),
    };
</script>
