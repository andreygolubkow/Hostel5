<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>АИС Общежитие</span>
        <span class="font-weight-light">Администратор</span>
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
          <v-list-item to="/admin/index">
            <v-list-item-title>Обзор</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/message">
            <v-list-item-title>Сообщения</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/peoples">
            <v-list-item-title>Контингент</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/rooms">
            <v-list-item-title>Комнаты</v-list-item-title>
          </v-list-item>
          <v-list-item to="/admin/users">
            <v-list-item-title>Пользователи</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <v-btn
        text
        href="https://общага5.рф">
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
