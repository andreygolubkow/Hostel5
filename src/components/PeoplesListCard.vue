<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <b v-if="!peoples">Подключите список peoples</b>
        <v-card v-if="peoples">
          <v-list three-line>
            <v-container v-if="!editor">
              <v-list-item v-for="(p, index) in peoples" :to="`${p._id}`">
                <v-list-item-content>
                  <v-list-item-title>{{p.name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{`к.${p.room}, ${p.faculty}, ${p.group}`}}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{`Заметок: ${p.notes.length}`}}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-container>

            <v-container v-if="editor">
              <v-list-item v-for="(p, index) in peoples">
                <v-list-item-content>
                  <v-list-item-title>{{p.name}}</v-list-item-title>
                  <v-list-item-subtitle>
                    {{`к.${p.room}, ${p.faculty}, ${p.group}`}}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    {{`Заметок: ${p.notes.length}`}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn icon @click="trashClick(p._id)">
                    <v-icon color="grey lighten-1">fa-trash</v-icon>
                  </v-btn>
                  <v-btn icon :to="`${p._id}`">
                    <v-icon color="grey lighten-1">fa-id-card</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-container>

          </v-list>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
    props: ['peoples', 'editor'],
    data: () => ({
  }),
    methods: {
        trashClick (id) {
            this.$emit('trashClick', id);
        }
    }
};
</script>
