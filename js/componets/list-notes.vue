<template>
    <div>
        <div class="group-form block-center">
            <div class="group-btn">
                <a class="btn btn-primary" href="note.html">Добавить заметку</a>
            </div>
        </div>
        <div class="group-form content">
            <template v-if="loadingListNotes">
                <div class="block-center">
                    <span class="loading-spinner sm"></span>
                </div>
            </template>
            <template v-else>
                <template v-if="listNotes !== null && listNotes.length > 0">
                    <div class="group-form">
                        <h3>Список заметок</h3>
                        <div class="table">
                            <div class="tr header">
                                <span class="col-3">#</span>
                                <span class="col-3">Задача</span>
                                <span class="col-3">Заметки</span>
                                <span class="col-3"></span>
                            </div>

                            <template v-for="(note,index) in listNotes">
                                <div class="tr">
                                    <span class="col-3">{{ index+1 }}</span>
                                    <span class="col-3">{{ note.name }}</span>
                                    <span class="col-3 flex-column">
                                        <template v-for="(todo,index) in note.todo">
                                            <span v-if="index<3"
                                                  v-bind:class="{'text-primary':todo.isPerformed,'text-danger':!todo.isPerformed}">{{ todo.name }}
                                            </span>
                                        </template>
                                    </span>
                                    <span class="col-3 flex-column">
                                    <a class="btn btn-outline-primary btn-sm"
                                       :href="'note.html?id='+encodeURIComponent(note.id)">Редактировать</a>
                                    <a class="btn btn-outline-danger btn-sm" v-on:click="deleteNotes(note)">Удалить</a>
                                </span>
                                </div>
                            </template>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <div class="alert alert-warning">
                        У вас нет заметок
                    </div>
                </template>
            </template>
        </div>
        <modal :is-modal="modal.isModal"
               :html="modal.html"
               :type="modal.type"
               v-on:closeForm="closeFormDeleteNotes"
        ></modal>

    </div>
</template>

<script>
    import Modal from "./modal.vue";

    export default {
        name: "list-notes",
        components: {Modal},
        data: function () {
            return {
                listNotes: null,
                loadingListNotes: true,
                deleteElement: null,
                modal: {
                    isModal: false,
                    html: null,
                    type: "confirmation"
                }
            }
        },
        methods: {
            loadingList: function () {
                var local = localStorage.getItem('listNotes');
                if (local === null) {
                    localStorage.setItem('listNotes', JSON.stringify([]));
                    local = localStorage.getItem('listNotes');
                }
                this.listNotes = JSON.parse(local);
                this.loadingListNotes = false;
            },
            closeFormDeleteNotes: function (t) {
                if (t === "cancel") {
                    this.modal.isModal = false;
                } else {
                    this.listNotes = this.listNotes.filter((item) => {
                        return item !== this.deleteElement
                    });
                    localStorage.setItem('listNotes', JSON.stringify(this.listNotes));
                    this.modal.html = "<h3>Заметка успешно удалена</h3>";
                    this.modal.type = "notification";
                }
            },
            deleteNotes: function (n) {
                this.deleteElement = n;
                this.modal.html = "<h3>Удалить заметку?</h3>";
                this.modal.type = "confirmation";
                this.modal.isModal = true;
            }
        },
        created: function () {
            this.loadingList();
        }
    }
</script>

<style scoped>
    .content {
        position: relative;
    }


</style>