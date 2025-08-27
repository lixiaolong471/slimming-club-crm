# 减肥馆管理系统 (Slimming Club CRM)

## 项目概述

一个专业的减肥馆客户关系管理系统，用于管理客户信息、预约安排、消费记录、体重跟踪以及生成各类业务报表。系统采用现代化的技术栈，提供直观的用户界面和完善的业务功能。

## 技术栈

### 前端技术
- **Next.js 15.5.0** - React 全栈框架（使用 Turbopack）
- **React 19.1.0** - UI 库
- **TypeScript 5.x** - 类型安全
- **Tailwind CSS 4** - 样式框架
- **Lucide React** - 图标库
- **Recharts** - 数据可视化图表
- **date-fns** - 日期处理

### 后端技术
- **Next.js API Routes** - API 端点
- **Better SQLite3** - 数据库
- **bcryptjs** - 密码加密
- **jsonwebtoken** - JWT 认证

### 开发工具
- **ESLint** - 代码检查
- **PostCSS** - CSS 处理

## 目录结构

```
slimming-club-crm/
├── app/                        # Next.js 13+ App Router 目录
│   ├── (protected)/           # 需要认证的页面
│   │   ├── appointments/      # 预约管理
│   │   ├── consumption/       # 消费记录
│   │   ├── customers/         # 客户管理
│   │   │   └── [id]/         # 客户详情页
│   │   ├── dashboard/         # 仪表盘
│   │   ├── reports/           # 报表分析
│   │   ├── service-types/     # 服务类型管理
│   │   ├── settings/          # 系统设置
│   │   └── layout.tsx         # 受保护页面布局
│   ├── api/                   # API 路由
│   │   ├── appointments/      # 预约 API
│   │   ├── auth/              # 认证 API
│   │   │   ├── login/        # 登录
│   │   │   ├── logout/       # 登出
│   │   │   ├── me/           # 用户信息
│   │   │   └── change-password/ # 修改密码
│   │   ├── consumption/       # 消费记录 API
│   │   ├── customers/         # 客户 API
│   │   ├── reports/           # 报表 API
│   │   ├── service-types/     # 服务类型 API
│   │   ├── stats/             # 统计 API
│   │   └── weight-records/    # 体重记录 API
│   ├── login/                 # 登录页面
│   ├── globals.css            # 全局样式
│   ├── layout.tsx             # 根布局
│   └── page.tsx               # 首页（重定向）
├── components/                 # React 组件
│   ├── AuthProvider.tsx       # 认证上下文提供者
│   ├── EmptyState.tsx         # 空状态组件
│   └── Sidebar.tsx            # 侧边栏导航
├── lib/                        # 工具库
│   ├── api.ts                 # API 工具函数
│   ├── auth.ts                # 认证相关函数
│   ├── db.ts                  # 数据库连接和初始化
│   └── types.ts               # TypeScript 类型定义
├── scripts/                    # 脚本文件
│   └── init-admin.js          # 初始化管理员账户
├── public/                     # 静态资源
├── middleware.ts               # Next.js 中间件（认证）
├── slimming-club.db           # SQLite 数据库文件
└── package.json               # 项目依赖配置
```

## 功能模块

### 1. 用户认证
- **登录系统** - JWT Token 认证
- **权限管理** - admin/staff 角色区分
- **密码修改** - 安全的密码更新功能
- **会话管理** - 自动登出和Token刷新

### 2. 客户管理
- **客户档案** - 完整的客户信息记录
  - 基本信息（姓名、电话、性别、年龄）
  - 身体数据（身高、初始体重、目标体重）
  - 联系信息（地址、备注）
- **客户搜索** - 按姓名或电话快速查找
- **客户详情** - 个人档案、体重记录、消费历史

### 3. 预约管理
- **预约安排** - 创建和管理客户预约
- **状态管理** - 待完成/已完成/已取消
- **预约筛选** - 按状态筛选预约
- **服务类型** - 多种服务类型选择

### 4. 消费记录
- **消费登记** - 记录客户消费信息
- **支付方式** - 现金/微信/支付宝/银行卡/会员卡
- **服务定价** - 自动关联服务类型价格
- **消费历史** - 完整的消费记录查询

### 5. 体重跟踪
- **体重记录** - 定期记录客户体重变化
- **身体指标** - 体脂率、肌肉量等数据
- **进度图表** - 可视化体重变化趋势
- **减重成效** - 自动计算减重进度

### 6. 报表分析
- **收入分析**
  - 日/周/月收入趋势图
  - 服务类型收入分布
  - 支付方式分析
  - TOP客户排行
- **客户分析**
  - 客户总数和活跃度
  - 减重进度跟踪
  - 月度数据汇总
- **数据导出** - CSV格式导出报表

### 7. 服务类型管理
- **服务配置** - 管理各类服务项目
- **价格设置** - 灵活的价格配置
- **状态控制** - 启用/停用服务

### 8. 系统设置
- **个人信息** - 修改用户资料
- **密码管理** - 安全修改密码
- **系统配置** - 基础设置选项

## 数据库设计

### 主要数据表

1. **users** - 系统用户表
   - 用户认证信息
   - 角色权限

2. **customers** - 客户信息表
   - 客户基本信息
   - 身体数据
   - 联系方式

3. **appointments** - 预约记录表
   - 预约时间
   - 服务类型
   - 预约状态

4. **consumption_records** - 消费记录表
   - 消费金额
   - 支付方式
   - 服务项目

5. **weight_records** - 体重记录表
   - 体重数据
   - 身体指标
   - 记录时间

6. **service_types** - 服务类型表
   - 服务名称
   - 服务价格
   - 服务描述

## 安装与部署

### 环境要求
- Node.js 18.x 或更高版本
- npm 或 yarn 包管理器

### 安装步骤

1. **克隆项目**
```bash
git clone [repository-url]
cd slimming-club-crm
```

2. **安装依赖**
```bash
npm install
```

3. **初始化管理员账户**
```bash
node scripts/init-admin.js
```

4. **启动开发服务器**
```bash
npm run dev
```
访问 http://localhost:3000

### 生产部署

1. **构建项目**
```bash
npm run build
```

2. **启动生产服务器**
```bash
npm run start
```

### 部署方式

#### 1. PM2 部署（推荐）
```bash
# 安装 PM2
npm install -g pm2

# 启动应用
pm2 start npm --name "slimming-crm" -- start

# 设置开机自启
pm2 startup
pm2 save
```

#### 2. Docker 部署
可创建 Dockerfile 进行容器化部署

#### 3. Vercel 部署
- 推送代码到 GitHub
- 在 Vercel 导入项目
- 自动构建部署

## 默认账户

- **用户名**: admin
- **密码**: admin123

⚠️ **注意**: 首次登录后请立即修改默认密码！

## API 接口文档

### 认证相关

#### POST /api/auth/login
登录接口
```json
{
  "username": "admin",
  "password": "admin123"
}
```

#### POST /api/auth/logout
登出接口

#### GET /api/auth/me
获取当前用户信息

#### POST /api/auth/change-password
修改密码
```json
{
  "oldPassword": "old_password",
  "newPassword": "new_password"
}
```

### 客户管理

#### GET /api/customers
获取客户列表

#### POST /api/customers
创建新客户

#### GET /api/customers/[id]
获取客户详情

#### PUT /api/customers/[id]
更新客户信息

#### DELETE /api/customers/[id]
删除客户

### 预约管理

#### GET /api/appointments
获取预约列表

#### POST /api/appointments
创建新预约

#### PATCH /api/appointments/[id]
更新预约状态

#### DELETE /api/appointments/[id]
删除预约

### 消费记录

#### GET /api/consumption
获取消费记录

#### POST /api/consumption
添加消费记录

### 体重记录

#### GET /api/weight-records
获取体重记录

#### POST /api/weight-records
添加体重记录

#### DELETE /api/weight-records/[id]
删除体重记录

### 报表统计

#### GET /api/stats
获取仪表盘统计数据

#### GET /api/reports
获取详细报表数据

## 特性亮点

✨ **现代化界面** - 简洁直观的用户界面设计
🔒 **安全认证** - JWT Token 认证机制
📊 **数据可视化** - 丰富的图表展示
📱 **响应式设计** - 支持多种设备访问
🎯 **空状态提示** - 友好的空数据提示
⚡ **高性能** - Turbopack 构建，快速响应
🔍 **搜索功能** - 快速查找客户信息
📈 **业务分析** - 多维度数据分析

## 性能优化

- 使用 Turbopack 提升构建速度
- 路由懒加载优化首屏加载
- 数据库索引优化查询性能
- 组件代码分割减少包体积

## 安全措施

- 密码 bcrypt 加密存储
- JWT Token 认证
- API 路由保护
- SQL 注入防护
- XSS 攻击防护

## 开发规范

- TypeScript 严格类型检查
- ESLint 代码规范检查
- 组件化开发模式
- RESTful API 设计
- Git 版本控制

## 维护说明

### 数据库备份
定期备份 `slimming-club.db` 文件

### 日志管理
日志文件位于 `logs/` 目录：
- `combined-0.log` - 综合日志
- `err-0.log` - 错误日志
- `out-0.log` - 输出日志

### 更新依赖
```bash
npm update
```

## 故障排查

### 无法登录
1. 确认数据库文件存在
2. 运行 `node scripts/init-admin.js` 重置管理员账户
3. 检查 JWT_SECRET 环境变量

### 数据库错误
1. 检查数据库文件权限
2. 确保数据库路径正确
3. 查看错误日志文件

## 版本历史

### v0.1.0 (当前版本)
- 基础功能实现
- 客户管理模块
- 预约系统
- 消费记录
- 体重跟踪
- 报表分析
- 用户认证

## 联系支持

如有问题或建议，请联系技术支持团队。

## 许可证

本项目为私有项目，版权所有。

---

*最后更新: 2025年1月*