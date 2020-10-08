<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>购物车</el-breadcrumb-item>
    </el-breadcrumb>
    <el-table :data="cartProducts" style="width: 100%">
      <el-table-column width="55">
        <template v-slot:header>
          <el-checkbox
            size="mini"
            :value="allChecked"
            @change="toggleAllChecked(!allChecked)"
          />
        </template>
        <!--
          @change="updateProductChecked"  默认参数：更新后的值
          @change="updateProductChecked(productId, $event)"  123, 原来那个默认参数
            当你传递了自定义参数的时候，还想得到原来那个默认参数，就手动传递一个 $event
         -->
        <template v-slot="scope">
          <el-checkbox
            size="mini"
            :value="scope.row.checked"
            @change="toggleChecked(scope.row.id)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="title" label="商品">
      </el-table-column>
      <el-table-column prop="price" label="单价">
      </el-table-column>
      <el-table-column prop="count" label="数量">
        <template v-slot="scope">
          <el-input-number
            size="mini"
            :min="1"
            :value="scope.row.count"
            @change="updateCount({ id: scope.row.id, count: $event })"
          />
        </template>
      </el-table-column>
      <el-table-column prop="total" label="小计">
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button size="mini" @click="deleteFromCart(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div>
      <p>已选 <span>{{ checkedTotalCount }}</span> 件商品，总价：<span>{{ checkedTotalPrice }}</span></p>
      <el-button type="danger" @click="pay">结算</el-button>
    </div>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState, mapGetters, mapMutations, mapActions } = createNamespacedHelpers('cart')

export default {
  name: 'Cart',
  computed: {
    ...mapState(['cartProducts']),
    ...mapGetters(['checkedTotalCount', 'checkedTotalPrice', 'allChecked'])
  },
  methods: {
    ...mapMutations([
      'deleteFromCart', 'updateCount',
      'toggleChecked', 'toggleAllChecked',
      'pay'
    ]),
    ...mapActions(['pay'])
  }
}
</script>

<style></style>
