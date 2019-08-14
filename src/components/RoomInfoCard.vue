<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-progress-linear
          v-if="!room"
          indeterminate
          color="primary"
        ></v-progress-linear>
        <v-card v-if="room"
          class="mx-auto"
        >
          <v-card-title class="title">
            {{room.room}}
          </v-card-title>

          <v-card-text>
            <v-list dense three-line>
              <template v-for="(people, index) in room.peoples">

                <v-list-item
                  :key="index"
                  @click.stop="peopleClick(people)"
                >
                  <v-list-item-avatar>
                    <v-img src="https://avatars.mds.yandex.net/get-pdb/2011865/d5f09e42-e045-4605-8bf2-cfe03f5aba87/s1200"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title v-html="`${people.name} ${people.rate}`"></v-list-item-title>
                    <v-list-item-subtitle v-html="`${people.group} ${people.faculty} ${people.eduForm} `"></v-list-item-subtitle>
                    <v-list-item-subtitle v-if="people.notes&& people.notes.length>0" v-html="`${people.notes[people.notes.length-1].text}`"></v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-list>

          </v-card-text>

          <v-card-actions>
            <v-btn text color="green" @click="changeRate(1)">+1</v-btn>
            <v-btn text color="red" @click="changeRate(-1)">-1</v-btn>
            <v-btn text @click.stop="addNote()">Заметка</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        props: ['room'],
        data: () => ({
        }),
        methods: {
            changeRate(count) {
                this.$emit('changeRate', count);
            },
            addNote(count) {
                this.$emit('addNote', count);
            },
            peopleClick (people) {
                this.$emit('peopleClick', people);
            }
        }
    };
</script>
