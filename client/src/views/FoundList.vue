<template>
  <div class="fillContainer">
    <el-form
      :inline="true"
      ref="search_data"
      :model='search_data'
    >
      <el-form-item label="按照时间筛选:">
        <el-date-picker
          v-model="search_data.startTime"
          type="datetime"
          placeholder="选择开始时间">
        </el-date-picker>
        --
        <el-date-picker
          v-model="search_data.endTime"
          type="datetime"
          placeholder="选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" icon="search" @click='handleSearch()'>筛选</el-button>
      </el-form-item>
      <el-form-item class="btnRight">
        <!--<el-button type="primary" size="small" icon="view" @click='handleAdd()' v-if="user.identity==='employer'">员工</el-button>-->
        <el-button type="primary" size="small" icon="view" @click='handleAdd()' v-if="user.identity==='manager'">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-if="tableData.length>0"
      :data="tableData"
      style="width: 100%"
      max-height="450"
      :default-sort="{prop: 'date', order: 'descending'}"
      border>
      <el-table-column
        type="index"
        label="序号"
        align='center'
        width="70">
      </el-table-column>
      <el-table-column
        prop="date"
        label="创建时间"
        width="250"
        align='center'
        sortable>
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.date }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        label="收支类型"
        align='center'
        width="150">
      </el-table-column>
      <el-table-column
        prop="describe"
        label="收支描述"
        align='center'
        width="180">
      </el-table-column>
      <el-table-column
        prop="income"
        label="收入"
        align='center'
        width="170">
        <template slot-scope="scope">
          <span style="color:#00d053">+ {{ scope.row.income }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="expend"
        label="支出"
        align='center'
        width="170">
        <template slot-scope="scope">
          <span style="color:#f56767">- {{ scope.row.expend }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="cash"
        label="账户现金"
        align='center'
        width="170">
        <template slot-scope="scope">
          <span style="color:#4db3ff">{{ scope.row.cash }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        label="备注"
        align='center'
        width="220">
      </el-table-column>
      <el-table-column
        prop="operation"
        align='center'
        label="操作"
        fixed="right"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            type="success"
            icon="edit"
            @click="handleEdit(scope.$index, scope.row)">编辑
          </el-button>
          <el-button
            type="danger"
            icon='delete'
            size="small"
            slot="reference"
            @click="handleDelete(scope.$index, scope.row)">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹框页面 -->
    <DialogFound :dialog='dialog' :formData='formData' @update="getProfile"></DialogFound>
    <!--分页-->
    <el-row>
      <el-col :span="24">
        <div class="pagination">
          <el-pagination
            v-if="paginations.total>0"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="paginations.page_index"
            :page-sizes="paginations.page_sizes"
            :page-size="paginations.page_size"
            :layout="paginations.layout"
            :total="paginations.total">
          </el-pagination>
        </div>
      </el-col>
    </el-row>


  </div>
</template>

<script>
  import DialogFound from "../components/DialogFound";

  export default {
    name: "FoundList",
    data() {
      return {
        allTableData: [],
        tableData: [],
        filterTableData:[],
        visible: false,
        search_data: {
          startTime: "",
          endTime: ""
        },
        dialog: {
          show: false,
          title: "",
          option: "edit"
        },
        formData: {
          type: "",
          describe: "",
          income: "",
          expend: "",
          cash: "",
          remark: "",
          id: ""
        },
        //需要给分页组件传的信息
        paginations: {
          page_index: 1,//当前位于哪一页
          total: 0,    //总数
          page_size: 5, //一页显示多少条
          page_sizes: [5, 10, 15, 20],//每页显示多少条
          layout: "total, sizes, prev, pager, next, jumper" // 翻页属性
        }
      }
    },
    components: {
      DialogFound
    },
    created() {
      this.getProfile()
    },
    computed:{
      user(){
       return this.$store.getters.user;
      }
    },
    methods: {
      getProfile() {
        //获取表格数据
        this.$axios.get('/api/profiles')
          .then(res => {
            this.allTableData = res.data;
            this.filterTableData=res.data;
            this.setPaginations();
          })
          .catch(err => {
            console.log(err)
          })
      },
      handleEdit(index, row) {
        // 编辑
        console.log(row)
        this.dialog = {
          show: true,
          title: "修改资金信息",
          option: "edit"
        }
        this.formData = {
          type: row.type,
          describe: row.describe,
          income: row.income,
          expend: row.expend,
          cash: row.cash,
          remark: row.remark,
          id: row._id
        }
      },
      handleDelete(index, row) {
        //删除
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.delete(`/api/profiles/delete/${row._id}`).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getProfile();
          })

        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });

      },
      handleSearch() {
        //筛选
        if(!this.search_data.startTime || !this.search_data.endTime){
          this.$message({
            type:'warning',
            message:'请选择时间区间'
          })
          //this.getProfile();
          return;
        }
        const sTime=this.search_data.startTime.getTime();
        const eTime=this.search_data.endTime.getTime();

        this.allTableData=this.filterTableData.filter(item=>{
          let time=new Date(item.date).getTime();

          return time>=sTime && time<eTime;
        })
//分页
        this.setPaginations();
      },
      handleAdd() {
        // 添加
        this.dialog = {
          show: true,
          title: "添加资金信息",
          option: "add"
        };
        this.formData = {
          type: "",
          describe: "",
          income: "",
          expend: "",
          cash: "",
          remark: "",
          id: ""
        };
      },
      handleSizeChange(page_size) {
//切换size
        this.paginations.page_index = 1;
        this.paginations.page_size = page_size;
        this.tableData = this.allTableData.filter((item, index) => {
          return index < page_size;
        })
      },
      handleCurrentChange(page) {
// 切换页码
        //当前页
        let sortnum = this.paginations.page_size * (page - 1);
        let table = this.allTableData.filter((item, index) => {
          return index >= sortnum;
        })
        this.tableData = table.filter((item, index) => {
          return index < this.paginations.page_size;
        })

        //另一种写法
        // let tables = [];
        // let index = this.paginations.page_size * (page - 1);
        // let nums = this.paginations.page_size * page;
        //
        // for (let i = index; i < nums; i++) {
        //   if (this.allTableData[i]) {
        //     tables.push(this.allTableData[i]);
        //   }
        //   this.tableData = tables;
        // }
      },
      setPaginations() {
        this.paginations.total = this.allTableData.length;
// 设置默认分页数据
        this.tableData = this.allTableData.filter((item, index) => {
          return index < this.paginations.page_size
        })
      }
    }
  }
</script>

<style scoped>
  .fillContainer {
    width: 100%;
    height: 100%;
    padding: 16px;
    box-sizing: border-box;
  }

  .btnRight {
    float: right;
  }

  .pagination {
    text-align: right;
    margin-top: 10px;
  }
</style>
