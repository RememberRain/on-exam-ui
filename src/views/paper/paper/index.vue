<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="试卷编号" prop="paperId">
        <el-input
          v-model="queryParams.paperId"
          placeholder="请输入试卷编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="试卷名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入试卷名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="dict in dict.type.paper_status"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属学科" prop="subject">
        <el-select v-model="queryParams.subject" placeholder="请选择所属学科" clearable>
          <el-option
            v-for="dict in dict.type.subject"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="出题人" prop="createUser">
        <el-input
          v-model="queryParams.createUser"
          placeholder="请输入出题人"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工号" prop="createUserId">
        <el-input
          v-model="queryParams.createUserId"
          placeholder="请输入出题人工号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="开始时间" prop="startTime">
        <el-date-picker clearable
          v-model="queryParams.startTime"
          type="datetime"
          value-format="yyyy-MM-dd hh:ii:ss"
          placeholder="请选择考试开始时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="结束时间" prop="endTime">
        <el-date-picker clearable
          v-model="queryParams.endTime"
          type="datetime"
          value-format="yyyy-MM-dd hh:ii:ss"
          placeholder="请选择结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['paper:paper:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['paper:paper:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['paper:paper:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['paper:paper:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="paperList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="试卷编号" align="center" prop="paperId" />
      <el-table-column label="试卷名称" align="center" prop="name" />
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.paper_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="所属学科" align="center" prop="subject">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.subject" :value="scope.row.subject"/>
        </template>
      </el-table-column>
      <el-table-column label="出题人" align="center" prop="createUser" />
      <el-table-column label="工号" align="center" prop="createUserId" />
      <el-table-column label="开始时间" align="center" prop="startTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.startTime, '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="结束时间" align="center" prop="endTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.endTime, '{yyyy}-{mm}-{dd} {hh}:{ii}:{ss}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['paper:paper:edit']"
          >修改</el-button>
          <el-button
            v-if="scope.row.status === '待组卷'"
            size="mini"
            type="text"
            icon="el-icon-collection"
            @click="goToFormPaper(scope.row)"
            v-hasPermi="['paper:paper:remove']"
          >进入组卷</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改试卷管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="试卷名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入试卷名称" />
        </el-form-item>
        <el-form-item label="所属学科" prop="subject">
          <el-select v-model="form.subject" placeholder="请选择所属学科">
            <el-option
              v-for="dict in dict.type.subject"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出题人" prop="createUser">
          <el-input v-model="form.createUser" placeholder="请输入出题人" />
        </el-form-item>
        <el-form-item label="工号" prop="createUserId">
          <el-input v-model="form.createUserId" placeholder="请输入出题人工号" />
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker clearable
            v-model="form.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择考试开始时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker clearable
            v-model="form.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="请选择考试结束时间">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listPaper, getPaper, delPaper, addPaper, updatePaper } from "@/api/paper/paper";
import {parseTime} from "../../../utils/ruoyi";

export default {
  name: "Paper",
  dicts: ['paper_status', 'subject'],
  data() {
    return {
      value1: '',
      value2: '',
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 试卷管理表格数据
      paperList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        paperId: null,
        name: null,
        status: null,
        subject: null,
        createUser: null,
        createUserId: null,
        startTime: null,
        endTime: null
      },
      // 表单参数
      form: {
        startTime: new Date(),
        endTime: new Date()
      },
      // 表单校验
      rules: {
        name: [
          { required: true, message: "试卷名称不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "状态不能为空", trigger: "change" }
        ],
        subject: [
          { required: true, message: "所属学科不能为空", trigger: "change" }
        ],
        createUserId: [
          { required: true, message: "出题人工号不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime,
    /** 查询试卷管理列表 */
    getList() {
      this.loading = true;
      listPaper(this.queryParams).then(response => {
        this.paperList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        paperId: null,
        name: null,
        status: null,
        subject: null,
        createUser: null,
        createUserId: null,
        createTime: null,
        updateUser: null,
        updateTime: null,
        startTime: null,
        endTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.paperId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加试卷管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const paperId = row.paperId || this.ids
      getPaper(paperId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改试卷管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      console.log(this.form.startTime,this.form.endTime)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.paperId != null) {
            updatePaper(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addPaper(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    goToFormPaper(row){
      this.$router.push({path: '/paper/formPaper', query: {id: row.paperId, name: row.name, subject: row.subject}});
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const paperIds = row.paperId || this.ids;
      this.$modal.confirm('是否确认删除试卷管理编号为"' + paperIds + '"的数据项？').then(function() {
        return delPaper(paperIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('paper/paper/export', {
        ...this.queryParams
      }, `paper_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
