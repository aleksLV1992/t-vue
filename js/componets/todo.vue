<template>
    <div class="tr">
        <span class="col-3">{{ index+1 }}</span>
        <span class="col-3">
            <input class="form-control" v-model="todo.name"/>
        </span>
        <span class="col-3 position-relative block-center">
            <div class="checkbox-group">
                <input type="checkbox" :id="'todo-checkbox-'+(index+1)" v-model="todo.isPerformed" value="1" checked="">
                <label :for="'todo-checkbox-'+(index+1)"></label>
            </div>
        </span>
        <span class="col-3 block-center">
            <a class="btn btn-outline-danger btn-circle text-bold" v-on:click="openModal">&#10006;</a>
        </span>
        <modal :is-modal="modal.isModal"
               :html="modal.html"
               :type="modal.type"
               v-on:closeForm="deleteTodo"
        ></modal>
    </div>
</template>

<script>
    import Modal from "./modal.vue";

    export default {
        components: {Modal},
        props: {
            todo: {
                type: [Object],
                default: null
            },
            index: {
                type: [Number],
                default: 0
            }
        },
        name: "todo",
        data: function () {
            return {
                modal: {
                    isModal: false,
                    html: "<h3>Удалить задачу?</h3>",
                    type: "confirmation"
                }
            }
        },
        methods: {
            openModal: function () {
                this.modal.isModal = true;
            },
            deleteTodo: function (t) {
                if (t === "cancel") {
                    this.modal.isModal = false;
                } else {
                    this.$emit('deleteTodo', this.todo);
                    this.modal.isModal = false;
                }
            }
        }
    }
</script>

<style scoped>

</style>