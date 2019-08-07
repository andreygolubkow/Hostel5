<template>
  <people-info-card v-bind:people="people"></people-info-card>
</template>

<script>
    import PeopleInfoCard from "../../../components/PeopleInfoCard";
    export default {
        name: "PeopleView",
        components: {PeopleInfoCard},
        data: () => ({
          people: null
        }),
        watch: {
            '$route.params.id': {
                handler: function(id) {
                    this.getPeople(id);
                },
                deep: true,
                immediate: true
            }
        },
        methods: {
            getPeople (id) {
                this.people = {
                    _id: id,
                    name: "Иванов Петр Михайлович",
                    dob: "30.02.2001",
                    faculty: "ФВС",
                    group: "515-2",
                    phone: "+79961111111",
                    citizen: "РФ",
                    room: "301",
                    rate: 0,
                    notes: [
                        {
                            text: "Шумел",
                            date: "30.01.2019"
                        },
                        {
                            text: "Помог с дежурством",
                            date: "1.05.2019"
                        }
                    ],
                    friends: [
                        {
                            _id: 1,
                            name: "Михаил Петров"
                        },
                        {
                            _id: 2,
                            name: "Петр Первый"
                        }
                    ]
                }
            }
        }
    }
</script>

<style scoped>

</style>
