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
              placeholder="CSV документ"
              label="Список людей">
            </v-file-input>
            <span>Порядок полей: ФИО, Комната, Дата рождения, Факультет, Группа, Телефон, Гражданство</span>
          </v-card-text>
          <v-card-actions>
            <v-btn text @click="parseFile">Разобрать</v-btn>
            <v-btn text color="green">Отправить</v-btn>
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
            parseFile () {
                console.log(this.file);
            }
        }
    }
</script>

<style scoped>

</style>
