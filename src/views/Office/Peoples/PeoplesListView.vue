<template>
  <peoples-list v-bind:peoples="peoples" v-on:peopleClick="viewPeople"></peoples-list>
</template>

<script>
    import PeoplesList from "../../../components/PeoplesListCard";

    export default {
        name: "PeoplesListView",
        components: {PeoplesList},
        data: () => ({
            peoples: [
                {
                    _id: "0",
                    name: "Иванов Петр Михайлович",
                    dob: "30.02.2001",
                    faculty: "ФВС",
                    group: "515-2",
                    phone: "+79961111111",
                    citizen: "РФ",
                    room: "301",
                    notes: [
                        "Шумел",
                        "Помог с дежурством"
                    ]
                },
                {
                    _id: "1",
                    name: "Михайлов Владимир",
                    dob: "01.03.2000",
                    faculty: "РКФ",
                    group: "515-1",
                    phone: "+72222213314",
                    citizen: "Казахстан",
                    room: "302",
                    notes: [
                        "Помог с дежурством"
                    ]
                }
            ]
        }),
        methods: {
            viewPeople(people) {
                console.log(people);
            }
        }
    }
</script>

<style scoped>

</style>
