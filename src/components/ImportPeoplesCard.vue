<template>
  <v-container>
    <v-layout
      wrap >
      <v-flex xs12>
        <v-card class="mx-auto">
          <v-card-title>Импорт</v-card-title>
          <v-card-text>
            <v-file-input
              v-model="file"
              placeholder="XLSX документ"
              label="Список людей">
            </v-file-input>
            <span>Поля: name, dob, faculty, group, phone, citizen, room, sex, eduForm</span>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="sendFile" color="green">Отправить</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    export default {
        name: "ImportPeoplesCard",
        data: () => ({
            file: [],
        }),
        methods: {
            sendFile () {
                this.$emit('sendFile', this.file);
            }
        }
    }
</script>

<style scoped>

</style>
