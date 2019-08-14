<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-progress-linear
          v-if="!rooms"
          indeterminate
          color="primary"
        ></v-progress-linear>
        <v-card v-if="rooms">
          <v-list three-line>
            <v-container>
              <v-list-item v-for="(r, index) in rooms" :to="`${r._id}`">
                <v-list-item-content>
                  <v-list-item-title>{{r._id}}</v-list-item-title>
                  <v-list-item-subtitle>
                      <span v-for="(f,fi) in r.peoples">
                        {{f.faculty}}
                      </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                      <span v-for="(f,fi) in r.peoples">
                        {{f.citizen}}
                      </span>
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
    props: ['rooms'],
    data: () => ({
  }),
    methods: {
    }
};
</script>
