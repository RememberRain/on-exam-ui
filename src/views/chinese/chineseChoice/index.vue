<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="题目编号" prop="questionId">
        <el-input
          v-model="queryParams.questionId"
          placeholder="请输入题目编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="题型" prop="type">
        <el-select v-model="queryParams.type" placeholder="请选择题型" clearable>
          <el-option
            v-for="dict in dict.type.choice_type"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
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
          v-hasPermi="['chinese:chineseChoice:add']"
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
          v-hasPermi="['chinese:chineseChoice:edit']"
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
          v-hasPermi="['chinese:chineseChoice:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['chinese:chineseChoice:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="chineseChoiceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="题目编号" align="center" prop="questionId" />
      <el-table-column label="题干" align="center" prop="content" />
      <el-table-column label="题型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.choice_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['chinese:chineseChoice:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['chinese:chineseChoice:remove']"
          >删除</el-button>
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

    <!-- 添加或修改选择题对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="题干" prop="content">
          <el-input v-model="form.content" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="A" prop="choiceOne">
          <el-input v-model="form.choiceOne" placeholder="请输入A" />
        </el-form-item>
        <el-form-item label="B" prop="choiceTwo">
          <el-input v-model="form.choiceTwo" placeholder="请输入B" />
        </el-form-item>
        <el-form-item label="C" prop="choiceThree">
          <el-input v-model="form.choiceThree" placeholder="请输入C" />
        </el-form-item>
        <el-form-item label="D" prop="choiceFour">
          <el-input v-model="form.choiceFour" placeholder="请输入D" />
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-checkbox-group v-model="form.answer">
            <el-checkbox
              v-for="dict in dict.type.choice_answer"
              :key="dict.value"
              :label="dict.value">
              {{dict.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型">
            <el-option
              v-for="dict in dict.type.choice_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
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
import { listChineseChoice, getChineseChoice, delChineseChoice, addChineseChoice, updateChineseChoice } from "@/api/chinese/chineseChoice";

export default {
  name: "ChineseChoice",
  dicts: ['choice_answer', 'choice_type'],
  data() {
    return {
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
      // 选择题表格数据
      chineseChoiceList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        questionId: null,
        content: null,
        type: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        content: [
          { required: true, message: "题干不能为空", trigger: "blur" }
        ],
        choiceOne: [
          { required: true, message: "A不能为空", trigger: "blur" }
        ],
        choiceTwo: [
          { required: true, message: "B不能为空", trigger: "blur" }
        ],
        choiceThree: [
          { required: true, message: "C不能为空", trigger: "blur" }
        ],
        choiceFour: [
          { required: true, message: "D不能为空", trigger: "blur" }
        ],
        answer: [
          { required: true, message: "答案不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "题型不能为空", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询选择题列表 */
    getList() {
      this.loading = true;
      listChineseChoice(this.queryParams).then(response => {
        this.chineseChoiceList = response.rows;
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
        questionId: null,
        content: null,
        choiceOne: null,
        choiceTwo: null,
        choiceThree: null,
        choiceFour: null,
        answer: [],
        type: null
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
      this.ids = selection.map(item => item.questionId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加选择题";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const questionId = row.questionId || this.ids
      getChineseChoice(questionId).then(response => {
        this.form = response.data;
        this.form.answer = this.form.answer.split(",");
        this.open = true;
        this.title = "修改选择题";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.form.answer = this.form.answer.join(",");
          if (this.form.questionId != null) {
            updateChineseChoice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addChineseChoice(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const questionIds = row.questionId || this.ids;
      this.$modal.confirm('是否确认删除选择题编号为"' + questionIds + '"的数据项？').then(function() {
        return delChineseChoice(questionIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('chinese/chineseChoice/export', {
        ...this.queryParams
      }, `chineseChoice_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
