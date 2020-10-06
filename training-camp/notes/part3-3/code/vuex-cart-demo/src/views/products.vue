<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item><a href="#/">首页</a></el-breadcrumb-item>
      <el-breadcrumb-item><a href="#/">商品列表</a></el-breadcrumb-item>
    </el-breadcrumb>
    <el-table
      :data="products"
      style="width: 100%">
      <el-table-column
        prop="title"
        label="商品">
      </el-table-column>
      <el-table-column
        prop="price"
        label="价格">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template>
          <el-button>加入购物车</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  data () {
    return {
      products: [
        { id: 1, title: 'iPad Pro', price: 500.01 },
        { id: 2, title: 'H&M T-Shirt White', price: 10.99 },
        { id: 3, title: 'Charli XCX - Sucker CD', price: 19.99 }
      ]
    }
  }
}
</script>

<style></style>
