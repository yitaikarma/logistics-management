<template>
    <div>
        <a-input-search placeholder="请输入公司名" enter-button="搜索来往公司" style="width: 400px; margin-bottom: 20px" size="large" @search="onSearch" />
        <a-button style="margin-left: 10px" size="large" type="danger" @click="loadTableData"> 重置 </a-button>
        <a-table :loading="loading" :columns="columns" :data-source="data" rowKey="id">
            <a slot="company" slot-scope="company">{{ company }}</a>
            <span slot="customTitle"><a-icon type="bank" /> 公司名称</span>
        </a-table>
    </div>
</template>

<script>
import { FindAllCompany } from '../../api/company'

const columns = [
    {
        dataIndex: 'name',
        key: 'name',
        slots: { title: 'customTitle' },
        scopedSlots: { customRender: 'name' },
    },
    {
        title: '预留电话',
        key: 'phone',
        dataIndex: 'phone',
    },
    {
        title: '地址',
        key: 'address',
        dataIndex: 'address',
    },
    {
        title: '时间',
        dataIndex: 'createdAt',
        key: 'createdAt',
    },
]

const data = []

export default {
    data() {
        return {
            loading: false,
            data: [],
            columns,
        }
    },

    mounted() {
        this.loadTableData()
    },

    methods: {
        onSearch(value) {
            if (value) {
                this.loading = true
                SearchCompany(value).then(res => {
                    if (res.data.length === 0) {
                        this.$message.warn('未搜索到任何数据')
                        setTimeout(() => {
                            this.loading = false
                            this.data = res.data
                        }, 600)
                    } else {
                        setTimeout(() => {
                            this.$message.success('搜索到' + res.data.length + '个公司')
                            this.loading = false
                            this.data = res.data
                        }, 600)
                    }
                })
            } else {
                this.$message.warn('请输入搜索内容')
            }
        },
        loadTableData() {
            this.loading = true
            var that = this
            console.log('loadTableData')
            FindAllCompany().then(res => {
                console.log('FindAllSale返回')
                console.log(res)
                setTimeout(() => {
                    this.loading = false
                    this.data = res.data
                    that.loading = false
                }, 600)
            })
        },
    },
}
</script>

<style scoped>
.editable-add-btn {
    margin-bottom: 15px;
}
</style>
