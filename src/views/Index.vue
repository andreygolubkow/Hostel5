<template>
  <v-app>
      <v-app-bar app>
        <v-toolbar-title class="headline text-uppercase">
          <span>Hostel</span>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          text
          to="office"
        >
          <span class="mr-2">Office</span>
        </v-btn>
      </v-app-bar>
    <v-content>
      <b>Index Page</b>
    </v-content>
    </v-app>
</template>

<script>
    export default {
        name: 'Index',
        data: () => ({
            //
        }),
    };
</script>
