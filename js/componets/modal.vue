<template>
    <div class="custom-modal" v-bind:class="{'active':isModal}">
        <div class="custom-modal-container">
            <div class="group-form block-center">
                <span v-html="html"></span>
            </div>
            <template v-if="type === 'notification'">
                <div class="group-form block-center">
                    <div class="group-btn">
                        <a class="btn btn-outline-primary" v-on:click="closeForm('cancel')">Закрыть</a>
                    </div>
                </div>
            </template>
            <template v-else>
                <div class="group-form block-center">
                    <div class="group-btn">
                        <a class="btn btn-outline-danger" v-on:click="closeForm('yes')">Да</a>
                        <a class="btn btn-outline-secondary" v-on:click="closeForm('cancel')">Нет</a>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: [String],
                default: 'notification'
            },
            isModal: {
                type: [Boolean],
                default: false
            },
            html: {
                type: [String],
                default: ''
            }
        },
        name: "modal",
        methods: {
            closeForm: function (t) {
                this.$emit('closeForm', t);
            }
        }
    }
</script>

<style scoped>
    .custom-modal {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        z-index: 99;
        background-color: rgba(0, 0, 0, .8);
        display: none;
        align-items: center;
        justify-content: center;
    }

    .custom-modal.active {
        display: flex;
    }

    .custom-modal-container {
        position: relative;
        background-color: rgba(255, 255, 255, 1);
        border-radius: 8px;
        padding: 10px;
        border: 1px solid rgba(0, 0, 0, .8);;
        min-width: 350px;
        min-height: 100px;
    }
</style>