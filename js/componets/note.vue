<template>
    <div>
        <form>
            <div class="group-form">
                <label>Название заметки</label>
                <input :readonly="type === 'update'" class="form-control" v-model="nodeName"
                       v-on:keyup.enter="saveNote"/>
            </div>
            <div class="group-form">
                <h3 class="text-center">Список задач</h3>
                <template v-if="listTodo.length > 0">
                    <div class="table">
                        <div class="tr header">
                            <span class="col-3">#</span>
                            <span class="col-3">Задача</span>
                            <span class="col-3"></span>
                        </div>
                        <template v-for="(item,index) in listTodo">
                            <todo v-on:deleteTodo="deleteTodo" :todo="item" :index="index"></todo>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div class="alert alert-success">
                        Для добавления задачи нажмите на "&#10010;"
                    </div>
                </template>
            </div>
            <div class="group-form block-center hr-top">
                <template v-if="addTodo">
                    <div class="flex-column">
                        <input class="form-control" style="min-width: 350px;" v-model="formTodoName"
                               v-on:keyup.enter="saveTodo"/>
                        <a class="btn btn-outline-primary" v-on:click="saveTodo">Добавить задачу</a>
                        <template v-if="errorSaveTodo !== null">
                            <div class="alert alert-warning">
                                {{ errorSaveTodo }}
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <a class="btn btn-outline-primary btn-circle text-bold" v-on:click="openAddTodo">&#10010;</a>
                </template>
            </div>
            <template v-if="errorSaveNote !== null">
                <div class="group-form">
                    <div class="alert alert-warning">
                        {{ errorSaveNote }}
                    </div>
                </div>
            </template>
            <template v-if="activeHistory">
                <template v-if="listHistory !== null && listHistory.length>0">
                    <div class="table">
                        <div class="tr header">
                            <span class="col-3">#</span>
                            <span class="col-3">Задачи</span>
                            <span class="col-3">Дата</span>
                            <span class="col-3"></span>
                        </div>

                        <template v-for="(history,index) in listHistory">
                            <div class="tr">
                                <span class="col-3">{{ index+1 }}</span>
                                <span class="col-3 flex-column">
                                    <template v-for="(todo,index) in history.note">
                                        <span v-if="index<3"
                                              v-bind:class="{'text-primary':todo.isPerformed,'text-danger':!todo.isPerformed}">{{ todo.name }}
                                        </span>
                                    </template>
                                </span>
                                <span class="col-3">
                                    {{ new Date(history.date).toLocaleString() }}
                                </span>
                                <span class="col-3 flex-column">
                                    <template v-if="activeIdHistory  !== null && activeIdHistory === history.id">
                                      <span class="text-primary">Выбраная</span>
                                    </template>
                                    <template v-else>
                                        <a class="btn btn-outline-primary btn-sm"
                                           v-on:click="openUpdateHistory(history)">Выбрать</a>
                                    </template>
                                </span>
                            </div>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <div class="alert alert-warning">
                        Нет историй изменений по данной заметки
                    </div>
                </template>
            </template>
            <div class="group-form block-right">
                <div class="group-btn">
                    <template v-if="type === 'update'">
                        <a class="btn btn-outline-secondary" v-on:click="updateActiveHistory">
                        <span v-if="activeHistory">
                            Скрыть список изменений
                        </span> <span v-else>
                             Список изменений
                        </span>
                        </a>
                    </template>
                    <a class="btn btn-outline-secondary" href="index.html">Список заметок</a>
                    <a class="btn btn-primary" v-on:click="saveNote">Сохранить</a>
                </div>
            </div>
        </form>
        <modal :is-modal="modal.isModal"
               :html="modal.html"
               :type="modal.type"
               v-on:closeForm="closeForm">
        </modal>
    </div>
</template>

<script>
    import Todo from "./todo.vue";
    import Modal from "./modal.vue";

    export default {
        name: "note",
        components: {Modal, Todo},

        data: function () {
            return {
                type: 'insert',
                id: null,
                formTodoName: null,
                errorSaveTodo: null,
                errorSaveNote: null,
                listTodo: [],
                listHistory: [],
                addTodo: false,
                activeIdHistory: null,
                activeHistory: false,
                nodeName: null,
                dataHistory: null,
                modal: {
                    isModal: false,
                    html: "<h3>Заметка с успешно добавлена!</h3>",
                    type: "notification"
                }
            }
        },
        methods: {
            openUpdateHistory: function (h) {
                this.dataHistory = h;
                this.modal.html = "<h3>Вернуть выбранное состояние?</h3>";
                this.modal.type = "confirmation";
                this.modal.isModal = true;
            },
            updateActiveHistory: function () {
                this.activeHistory = !this.activeHistory;
            },
            deleteTodo: function (i) {
                this.listTodo = this.listTodo.filter((item) => {
                    return item !== i
                });

                this.isModal = true;
                this.modal.html = "<h3>Задача успешно удалена</h3>";
                this.modal.type = "notification";
            },
            closeForm: function (t) {
                if (t === "cancel") {
                    this.modal.isModal = false;
                } else {
                    let list = localStorage.getItem('listNotes');
                    if (list === null) {
                        localStorage.setItem('listNotes', JSON.stringify([]));
                        list = localStorage.getItem('listNotes');
                    }

                    list = JSON.parse(list);

                    list.forEach((item) => {
                        if (item.id === this.id) {
                            if (item.activeIdHistory === null) {
                                item.history.push(
                                    {
                                        id: btoa(new Date().toGMTString()),
                                        date: new Date(),
                                        name: this.nodeName,
                                        note: this.listTodo
                                    }
                                );
                            }

                            this.listHistory = item.history;
                            item.activeIdHistory = this.dataHistory.id;
                            this.activeIdHistory = this.dataHistory.id;
                            this.listTodo = this.dataHistory.note;
                            item.todo = this.dataHistory.note;
                        }
                    });

                    localStorage.setItem('listNotes', JSON.stringify(list));


                    this.modal.html = "<h3>Задача успешно восстановлена</h3>";
                    this.modal.type = "notification";
                }
            },
            openAddTodo: function () {
                this.addTodo = true;
            },
            saveNote: function () {
                if (this.nodeName === null || this.nodeName.trim().length === 0) {
                    this.errorSaveNote = "Имя заметки не может быть пустым";
                    return;
                }
                if (this.listTodo === null || this.listTodo.length === 0) {
                    this.errorSaveNote = "Добавите хотя бы одну задачу";
                    return;
                }
                let list = localStorage.getItem('listNotes');
                if (list === null) {
                    localStorage.setItem('listNotes', JSON.stringify([]));
                    list = localStorage.getItem('listNotes');
                }
                list = JSON.parse(list);

                if (this.type === 'insert') {
                    this.nodeName = this.nodeName.trim();
                    this.errorSaveNote = null;
                    let l = list.find((item) => {
                        return (item.name.toLowerCase() === this.nodeName.toLowerCase());
                    });
                    if (l === null || l === undefined) {
                        list.push({
                            id: btoa(unescape(encodeURIComponent(this.nodeName))),
                            name: this.nodeName,
                            todo: this.listTodo,
                            activeIdHistory: null,
                            history: []
                        });
                        localStorage.setItem('listNotes', JSON.stringify(list));
                        this.modal.isModal = true;
                        this.modal.html = "<h3>Заметка с успешно добавлена!</h3>";
                        this.listTodo = [];
                        this.nodeName = null;
                    } else {
                        this.errorSaveNote = "Заметка с данным именем уже существует";
                        return;
                    }
                } else if (this.type === 'update') {
                    list.forEach((item) => {
                        if (item.id === this.id && item.todo !== this.listTodo) {
                            var note = item;
                            item.history.push(
                                {
                                    id: btoa(new Date().toGMTString()),
                                    date: new Date(),
                                    name: this.nodeName,
                                    note: this.listTodo
                                }
                            );

                            this.listHistory = item.history;
                            item.activeIdHistory = null;
                            this.activeIdHistory = null;
                            item.todo = this.listTodo;
                        }
                    });

                    localStorage.setItem('listNotes', JSON.stringify(list));
                    this.modal.html = "<h3>Заметка с успешно обновлена!</h3>";
                    this.modal.isModal = true;
                }

            },
            saveTodo: function () {
                if (this.formTodoName === null || this.formTodoName.trim().length === 0) {
                    this.errorSaveTodo = "Имя задачи не может быть пустым";
                    return;
                }

                this.formTodoName = this.formTodoName.trim();
                this.errorSaveTodo = null;
                let l = this.listTodo.find((item) => {
                    return (item.name.toLowerCase() === this.formTodoName.toLowerCase());
                });

                if (l === null || l === undefined) {
                    this.listTodo.push({name: this.formTodoName, isPerformed: false});
                    this.formTodoName = null;
                } else {
                    this.errorSaveTodo = "Задача с данным именом уже существует";
                    return;
                }
                this.addTodo = false;
            },
            getParamsUrl: function (index) {
                var params = window
                    .location
                    .search
                    .replace('?', '')
                    .split('&')
                    .reduce(function (p, e) {
                            var a = e.split('=');
                            p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                            return p;
                        },
                        {}
                    );

                if (index in params) return params[index];
                return null;
            }
        },
        created: function () {
            this.$on('deleteTodo');
            let p = this.getParamsUrl('id');

            if (p !== null) {
                let list = localStorage.getItem('listNotes');
                if (list === null) {
                    localStorage.setItem('listNotes', JSON.stringify([]));
                    list = localStorage.getItem('listNotes');
                }
                list = JSON.parse(list);
                let l = list.find((item) => {
                    return (item.id === p);
                });


                if (l !== null || l !== undefined) {
                    this.type = "update";
                    this.listTodo = l.todo;
                    this.nodeName = l.name;
                    this.id = l.id;
                    this.activeIdHistory = l.activeIdHistory;
                    this.listHistory = l.history;
                }
            }
        }
    }
</script>

<style scoped>

</style>