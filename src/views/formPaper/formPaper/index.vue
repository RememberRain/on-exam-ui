<template>
  <div class="app-container">
    <!--    题型选择按钮-->
    <div style="display: flex; width: 300px; justify-content: space-between; margin-bottom: 15px">
      <el-button type="primary" plain :class="{active1: activeButton === 'choice'}" @click="activeTheChoice()">选择题
      </el-button>
      <el-button type="success" plain :class="{active2: activeButton === 'tf'}" @click="activeTheTf()">判断题
      </el-button>
      <el-button type="warning" plain :class="{active3: activeButton === 'sub'}" @click="activeTheSub()">主观题
      </el-button>
    </div>
    <!--    语文题目列表-->
    <div class="chinese" v-if="paperSubject === '语文'">
      <div class="choice" v-if="activeButton === 'choice'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
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


        <el-table v-loading="loading" :data="chineseChoiceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
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
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkChoiceClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="chineseChoiceTotal>0"
          :total="chineseChoiceTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getChineseChoiceList"
        />
      </div>
      <div class="tf" v-if="activeButton === 'tf'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="chineseTfList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="答案" align="center" prop="answer">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tf_answer" :value="scope.row.answer"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkTfClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="chineseTfTotal>0"
          :total="chineseTfTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getChineseTfList"
        />
      </div>
      <div class="sub" v-if="activeButton === 'sub'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="chineseSubList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkSubClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="chineseSubTotal>0"
          :total="chineseSubTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getChineseSubList"
        />
      </div>
    </div>
    <!--    数学题目列表-->
    <div class="math" v-if="paperSubject === '数学'">
      <div class="choice" v-if="activeButton === 'choice'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
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
        <el-table v-loading="loading" :data="mathChoiceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
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
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkChoiceClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="mathChoiceTotal>0"
          :total="mathChoiceTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getMathChoiceList"
        />
      </div>
      <div class="tf" v-if="activeButton === 'tf'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="mathTfList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkTfClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="mathTfTotal>0"
          :total="mathTfTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getMathTfList"
        />
      </div>
      <div class="sub" v-if="activeButton === 'sub'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="mathSubList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="答案" align="center" prop="answer">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tf_answer" :value="scope.row.answer"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkSubClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="mathSubTotal>0"
          :total="mathSubTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getMathSubList"
        />
      </div>
    </div>
    <!--    英语题目列表-->
    <div class="english" v-if="paperSubject === '英语'">
      <div class="choice" v-if="activeButton === 'choice'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
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
        <el-table v-loading="loading" :data="englishChoiceList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
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
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkChoiceClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="englishChoiceTotal>0"
          :total="englishChoiceTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getEnglishChoiceList"
        />
      </div>
      <div class="tf" v-if="activeButton === 'tf'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="englishTfList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkTfClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="englishTfTotal>0"
          :total="englishTfTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getEnglishTfList"
        />
      </div>
      <div class="sub" v-if="activeButton === 'sub'">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch"
                 label-width="68px">
          <el-form-item label="题目编号" prop="questionId">
            <el-input
              v-model="queryParams.questionId"
              placeholder="请输入题目编号"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
        <el-table v-loading="loading" :data="englishSubList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"/>
          <el-table-column label="题目编号" align="center" prop="questionId"/>
          <el-table-column label="题干" align="center" prop="content"/>
          <el-table-column label="答案" align="center" prop="answer">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tf_answer" :value="scope.row.answer"/>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-plus"
                @click="addQues(scope.row)"
                v-hasPermi="['chinese:chineseChoice:edit']"
              >添加
              </el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="checkSubClearly(scope.row)"
                v-hasPermi="['chinese:chineseChoice:remove']"
              >查看
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="englishSubTotal>0"
          :total="englishSubTotal"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getEnglishSubList"
        />
      </div>
    </div>

    <!-- 查看选择题对话框 -->
    <el-dialog :title="title" :visible.sync="open && this.activeButton === 'choice'" width="500px" append-to-body :show-close="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="题目编号">
          <el-input v-model="form.questionId" readonly/>
        </el-form-item>
        <el-form-item label="题干内容">
          <el-input v-model="form.content" readonly/>
        </el-form-item>
        <el-form-item label="选项1">
          <el-input v-model="form.choiceOne" readonly/>
        </el-form-item>
        <el-form-item label="选项2">
          <el-input v-model="form.choiceTwo" readonly/>
        </el-form-item>
        <el-form-item label="选项3">
          <el-input v-model="form.choiceThree" readonly/>
        </el-form-item>
        <el-form-item label="选项4">
          <el-input v-model="form.choiceFour" readonly/>
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input v-model="form.answer" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看判断题对话框 -->
    <el-dialog :title="title" :visible.sync="open && this.activeButton === 'tf'" width="500px" append-to-body :show-close="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="题目编号">
          <el-input v-model="form.questionId" readonly/>
        </el-form-item>
        <el-form-item label="题干内容">
          <el-input v-model="form.content" readonly/>
        </el-form-item>
        <el-form-item label="选项1">
          <el-input v-model="form.choiceOne" readonly/>
        </el-form-item>
        <el-form-item label="选项2">
          <el-input v-model="form.choiceTwo" readonly/>
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input v-model="form.answer" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看主观题对话框 -->
    <el-dialog :title="title" :visible.sync="open && this.activeButton === 'sub'" width="500px" append-to-body :show-close="false">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="题目编号">
          <el-input v-model="form.questionId" readonly/>
        </el-form-item>
        <el-form-item label="题干内容">
          <el-input v-model="form.content" readonly/>
        </el-form-item>
        <el-form-item label="参考答案">
          <el-input v-model="form.answer" readonly/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sure()">确 定</el-button>
      </div>
    </el-dialog>

    <!--    查看已选题目-->
    <el-dialog title="已选题目" :visible.sync="checkSelected" width="600px" :show-close="false">
      <el-table :data="selected">
        <el-table-column property="questionId" label="题目编号" width="150"></el-table-column>
        <el-table-column property="content" label="题干内容" width="300"></el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="deleteSelected(scope.row)"
              v-hasPermi="['chinese:chineseChoice:edit']"
            >删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--列表下的显示-->
    <div class="listBottom">
      <div style="display: flex">
        <div class="choiceCount">
          <span @click="showSelectedChoice">选择题:</span>
          <el-input readonly v-model="choiceCount"></el-input>
        </div>
        <div class="tfCount">
          <span @click="showSelectedTf">判断题:</span>
          <el-input readonly v-model="tfCount"></el-input>
        </div>
        <div class="subCount">
          <span @click="showSelectedSub">主观题:</span>
          <el-input readonly v-model="subCount"></el-input>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="resetThePaper()">重置</el-button>
        <el-button type="primary">预览</el-button>
        <el-button type="primary">组卷</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {listChineseChoice} from "@/api/chinese/chineseChoice";
import {listChineseTf} from "@/api/chinese/chineseTf";
import {listChineseSub} from "@/api/chinese/chineseSub";
import {getChineseChoice} from "@/api/chinese/chineseChoice";
import {getChineseTf} from "@/api/chinese/chineseTf";
import {getChineseSub} from "@/api/chinese/chineseSub";
import {listMathChoice} from "@/api/math/mathChoice";
import {listMathTf} from "@/api/math/mathTf";
import {listMathSub} from "@/api/math/mathSub";
import {getMathChoice} from "@/api/math/mathChoice";
import {getMathTf} from "@/api/math/mathTf";
import {getMathSub} from "@/api/math/mathSub";
import {listEnglishChoice} from "@/api/english/englishChoice";
import {listEnglishTf} from "@/api/english/englishTf";
import {listEnglishSub} from "@/api/english/englishSub";
import {getEnglishChoice} from "@/api/english/englishChoice";
import {getEnglishTf} from "@/api/english/englishTf";
import {getEnglishSub} from "@/api/english/englishSub";

export default {
  name: "formPaper",
  dicts: ['choice_answer', 'choice_type', 'tf_answer'],
  data() {
    return {
      // 查看已选题的当前题型
      selectedButton: 'choice',
      // 已选题目
      selected: [],
      checkSelected: false,
      form: {},
      // 试卷编号
      paperId: this.$route.query.id,
      paperName: this.$route.query.name,
      // 试卷科目
      paperSubject: this.$route.query.subject,
      //已选题目
      addRows: [],
      //当前列表展示题目的题型
      activeButton: 'choice',
      // 该题型题目数量
      choiceCount: 0,
      tfCount: 0,
      subCount: 0,
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
      chineseChoiceTotal: 0,
      chineseTfTotal: 0,
      chineseSubTotal: 0,
      mathChoiceTotal: 0,
      mathTfTotal: 0,
      mathSubTotal: 0,
      englishChoiceTotal: 0,
      englishTfTotal: 0,
      englishSubTotal: 0,
      // 题目表格数据
      chineseChoiceList: [],
      chineseTfList: [],
      chineseSubList: [],
      mathChoiceList: [],
      mathTfList: [],
      mathSubList: [],
      englishChoiceList: [],
      englishTfList: [],
      englishSubList: [],
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
    };
  },
  // 初始界面展示选择题题目列表
  created() {
    if (this.paperSubject === '语文') {
      this.getChineseChoiceList();
    } else if (this.paperSubject === '数学') {
      this.getMathChoiceList();
    } else {
      this.getEnglishChoiceList();
    }
  },
  methods: {
    //删除已选题目
    deleteSelected(row) {
      const rowIndex = this.selected.indexOf(row);
      if (rowIndex !== -1) {
        if (confirm('确认删除该题目吗?')) {
          this.selected.splice(rowIndex, 1);
          this.addRows.splice(rowIndex, 1);
          if (this.selectedButton === 'choice') {
            this.choiceCount--;
          } else if (this.selectedButton === 'tf') {
            this.tfCount--;
          } else {
            this.subCount--;
          }
        } else {
        }
      }
      if (this.selected.length === 0) {
        this.checkSelected = false;
      }
    },
    //显示已选选择题
    showSelectedChoice() {
      this.selectedButton = 'choice';
      const addRows = this.addRows;
      if (this.paperSubject === '语文') {
        this.selected = this.chineseChoiceList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '数学') {
        this.selected = this.mathChoiceList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '英语') {
        this.selected = this.englishChoiceList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
    },
    showSelectedTf() {
      this.selectedButton = 'tf';
      const addRows = this.addRows;
      if (this.paperSubject === '语文') {
        this.selected = this.chineseTfList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '数学') {
        this.selected = this.mathTfList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '英语') {
        this.selected = this.englishTfList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
    },
    showSelectedSub() {
      this.selectedButton = 'sub'
      const addRows = this.addRows;
      if (this.paperSubject === '语文') {
        this.selected = this.chineseSubList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '数学') {
        this.selected = this.mathSubList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
      if (this.paperSubject === '英语') {
        this.selected = this.englishSubList.filter(item => addRows.includes(item));
        this.checkSelected = true;
      }
    },
    sure() {
      this.open = false;
    },
    //查看选择题详情
    checkChoiceClearly(row) {
      const quesId = row.questionId;
      if (this.$route.query.subject === '语文') {
        getChineseChoice(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else if (this.$route.query.subject === '数学') {
        getMathChoice(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else {
        getEnglishChoice(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      }
    },
    checkTfClearly(row) {
      const quesId = row.questionId;
      if (this.$route.query.subject === '语文') {
        getChineseTf(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else if (this.$route.query.subject === '数学') {
        getMathTf(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else {
        getEnglishTf(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      }
    },
    checkSubClearly(row) {
      const quesId = row.questionId;
      if (this.$route.query.subject === '语文') {
        getChineseSub(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else if (this.$route.query.subject === '数学') {
        getMathSub(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      } else {
        getEnglishSub(quesId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = '详情';
        });
      }
    },
    //清空已选
    resetThePaper() {
      this.addRows = [];
      this.choiceCount = 0;
      this.tfCount = 0;
      this.subCount = 0;
    },
    //添加题目到试卷
    addQues(row) {
      if (this.addRows.includes(row)) {
        this.$message.error('该题目已添加!');
        return;
      }
      this.addRows.push(row);
      if (this.activeButton === 'choice') {
        this.choiceCount++;
      } else if (this.activeButton === 'tf') {
        this.tfCount++;
      } else {
        this.subCount++;
      }
      this.$message({
        message: '添加成功!',
        type: 'success'
      });
    },
    //切换查询题目列表类型
    activeTheChoice() {
      this.activeButton = 'choice';
      this.queryParams.pageNum = 1;
      if (this.paperSubject === '语文') {
        this.getChineseChoiceList();
      } else if (this.paperSubject === '数学') {
        this.getMathChoiceList();
      } else {
        this.getEnglishChoiceList();
      }
    },
    activeTheTf() {
      this.activeButton = 'tf';
      this.queryParams.pageNum = 1;
      if (this.paperSubject === '语文') {
        this.getChineseTfList();
      } else if (this.paperSubject === '数学') {
        this.getMathTfList();
      } else {
        this.getEnglishTfList();
      }
    },
    activeTheSub() {
      this.activeButton = 'sub';
      this.queryParams.pageNum = 1;
      if (this.paperSubject === '语文') {
        this.getChineseSubList();
      } else if (this.paperSubject === '数学') {
        this.getMathSubList();
      } else {
        this.getEnglishSubList();
      }
    },
    getList(){
      if (this.paperSubject === '语文'){
        if (this.activeButton === 'choice'){
          this.getChineseChoiceList();
        }else if (this.activeButton === 'tf'){
          this.getChineseTfList();
        }else {
          this.getChineseSubList();
        }
      }else if (this.paperSubject === '数学'){
        if (this.activeButton === 'choice'){
          this.getMathChoiceList();
        }else if (this.activeButton === 'tf'){
          this.getMathTfList();
        }else {
          this.getMathSubList();
        }
      }else {
        if (this.activeButton === 'choice'){
          this.getEnglishChoiceList();
        }else if (this.activeButton === 'tf'){
          this.getEnglishTfList();
        }else {
          this.getEnglishSubList();
        }
      }
    },
    /** 查询语文选择题列表 */
    getChineseChoiceList() {
      this.loading = true;
      listChineseChoice(this.queryParams).then(response => {
        this.chineseChoiceList = response.rows;
        this.chineseChoiceTotal = response.total;
        this.loading = false;
      });
    },
    /**查询语文判断题列表*/
    getChineseTfList() {
      this.loading = true;
      listChineseTf(this.queryParams).then(response => {
        this.chineseTfList = response.rows;
        this.chineseTfTotal = response.total;
        this.loading = false;
      });
    },
    /**查询语文主观题列表*/
    getChineseSubList() {
      this.loading = true;
      listChineseSub(this.queryParams).then(response => {
        this.chineseSubList = response.rows;
        this.chineseSubTotal = response.total;
        this.loading = false;
      });
    },
    /** 查询数学选择题列表 */
    getMathChoiceList() {
      this.loading = true;
      listMathChoice(this.queryParams).then(response => {
        this.mathChoiceList = response.rows;
        this.mathChoiceTotal = response.total;
        this.loading = false;
      });
    },
    /**查询数学判断题列表*/
    getMathTfList() {
      this.loading = true;
      listMathTf(this.queryParams).then(response => {
        this.mathTfList = response.rows;
        this.mathTfTotal = response.total;
        this.loading = false;
      });
    },
    /**查询数学主观题列表*/
    getMathSubList() {
      this.loading = true;
      listMathSub(this.queryParams).then(response => {
        this.mathSubList = response.rows;
        this.mathSubTotal = response.total;
        this.loading = false;
      });
    },
    /** 查询英语选择题列表 */
    getEnglishChoiceList() {
      this.loading = true;
      listEnglishChoice(this.queryParams).then(response => {
        this.englishChoiceList = response.rows;
        this.englishChoiceTotal = response.total;
        this.loading = false;
      });
    },
    /**查询英语判断题列表*/
    getEnglishTfList() {
      this.loading = true;
      listEnglishTf(this.queryParams).then(response => {
        this.englishTfList = response.rows;
        this.englishTfTotal = response.total;
        this.loading = false;
      });
    },
    /**查询英语主观题列表*/
    getEnglishSubList() {
      this.loading = true;
      listEnglishSub(this.queryParams).then(response => {
        this.englishSubList = response.rows;
        this.englishSubTotal = response.total;
        this.loading = false;
      });
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
      this.single = selection.length !== 1
      this.multiple = !selection.length
    }
  }
};
</script>

<style scoped>
.listBottom {
  justify-content: space-between;
  display: -webkit-box;
  position: absolute;
  bottom: 20px;
  white-space: nowrap;
  display: -ms-flexbox;
  display: flex;
  width: 1000px;
}

.listBottom span {
  font-weight: bold;
  font-size: 25px;
}

.listBottom span:hover {
  color: rgb(24, 144, 255);
  cursor: pointer;
}

.choiceCount, .tfCount, .subCount {
  display: flex;
  margin-right: 20px;
}

.active1 {
  background-color: rgb(24, 144, 255);
  color: white;
}

.active2 {
  background-color: rgb(19, 206, 102);
  color: white;
}

.active3 {
  background-color: rgb(255, 186, 0);
  color: white;
}
</style>

<style>
.listBottom .el-input {
  margin-left: 10px;
}

.listBottom .el-input--medium .el-input__inner {
  height: 36px;
  line-height: 36px;
  font-size: 25px;
  font-weight: bolder;
  color: black;
  border: none;
}
</style>

