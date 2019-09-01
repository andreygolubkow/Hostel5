<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-progress-linear
          v-if="!people"
          indeterminate
          color="primary"
        ></v-progress-linear>
        <v-card v-if="people"
          class="mx-auto"
        >
          <v-list-item>
            <v-list-item-content>
              <div class="overline"><a :to="{ name: 'room-view', params: { id: people.room._id }}">{{people.room.room}}</a> </div>
              <v-list-item-title class="headline mb-1">{{people.name}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>


          <v-card-text>
            {{people.dob}}
            {{people.faculty}}
            {{people.group}}
            {{people.citizen}}
            <a :href="`tel:${people.phone}`">{{people.phone}}</a>
          </v-card-text>

          <v-card-text>
            Соседи:
            <ol>
              <li v-for="(f,index) in people.friends">
                <router-link :to="{ name: 'people-view', params: { id: f._id }}">{{f.name}}</router-link>
              </li>
            </ol>
          </v-card-text>

          <v-card-text>
            <ul style="list-style-type: none">
              <li v-for="(n, index) in people.notes">{{n.text}}</li>
            </ul>
            <ul>rate: {{people.rate}}</ul>
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
        props: ['people'],
        data: () => ({
        }),
        methods: {
            changeRate(count) {
                this.$emit('changeRate', count);
            },
            addNote(count) {
                this.$emit('addNote', count);
            }
        }
    };
</script>
