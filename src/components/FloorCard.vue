<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-progress-linear
          v-if="!floor"
          indeterminate
          color="primary"
        ></v-progress-linear>
        <v-card v-if="floor">
          <v-card-title>
            {{floor.floor}} Этаж
          </v-card-title>
          <v-card-text>
            <span class="grey--text subtitle-1">{{floor.message}}</span>
          </v-card-text>
          <v-list two-line>
            <v-container>
              <v-list-item v-for="(r, index) in floor.rooms" :to="`${r._id}`">
                <v-list-item-content>
                  <v-list-item-title>{{r.room}}</v-list-item-title>
                  <v-list-item-subtitle v-if="r.sanitation">
                    Оценок Object.keys(r.sanitation).length
                  </v-list-item-subtitle>
                  <v-list-item-subtitle v-else>
                    Нет оценок
                  </v-list-item-subtitle>
                </v-list-item-content>
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
    props: ['floor'],
    data: () => ({
  }),
    methods: {
    },
};
</script>
