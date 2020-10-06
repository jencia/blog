<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="cartProducts"
      style="width: 100%"
    >
      <el-table-column
        width="55">
        <template v-slot:header>
          <el-checkbox size="mini">
          </el-checkbox>
        </template>
        <!--
          @change="updateProductChecked"  默认参数：更新后的值
          @change="updateProductChecked(productId, $event)"  123, 原来那个默认参数
            当你传递了自定义参数的时候，还想得到原来那个默认参数，就手动传递一个 $event
         -->
        <template v-slot="scope">
          <el-checkbox
            size="mini"
            :value="scope.row.isChecked"
          >
          </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        label="商品">
      </el-table-column>
      <el-table-column
        prop="price"
        label="单价">
      </el-table-column>
      <el-table-column
        prop="count"
        label="数量">
        <template>
          <el-input-number size="mini"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="小计">
      </el-table-column>
      <el-table-column
        label="操作">
        <template>
          <el-button size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>已选 <span>xxx</span> 件商品，总价：<span>xxx</span></p>
      <el-button type="danger">结算</el-button>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Cart',
  data () {
    return {
      cartProducts: [
        { id: 1, title: 'iPad Pro', price: 500.01 },
        { id: 2, title: 'H&M T-Shirt White', price: 10.99 },
        { id: 3, title: 'Charli XCX - Sucker CD', price: 19.99 }
      ]
    }
  }
}
</script>

<style></style>
