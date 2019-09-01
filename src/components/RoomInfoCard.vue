<template>
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
            <v-row justify="space-between">
              <v-col>{{room.room}}</v-col>
              <v-col class="text-right">
                <v-btn
                  icon
                  x-small
                  @click="leftClick"
                >
                  <v-icon>fa-chevron-left</v-icon>
                </v-btn>

                <v-btn
                  @click="rightClick"
                  icon
                  x-small
                >
                  <v-icon>fa-chevron-right</v-icon>
                </v-btn>
              </v-col>
            </v-row>
          </v-card-title>

          <v-card-text>
            <v-list dense three-line>
              <template v-for="(people, index) in room.peoples">

                <v-list-item
                  :key="index"
                  :to="{ name: 'people-view', params: { id: people._id }}"
                >
                  <v-list-item-avatar>
                    <v-icon v-if="people.sex === 'М'">fa-male</v-icon>
                    <v-icon v-else-if="people.sex === 'Ж'">fa-female</v-icon>
                    <v-icon v-else>fa-asterisk</v-icon>
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
            },
            leftClick () {
                this.$emit('leftClick');
            },
            rightClick () {
                this.$emit('rightClick');
            }
        }
    };
</script>
