import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch, Ellipse, Polygon
import numpy as np

plt.rcParams['font.sans-serif'] = ['SimHei', 'Microsoft YaHei']
plt.rcParams['axes.unicode_minus'] = False

fig, ax = plt.subplots(1, 1, figsize=(30, 22))
ax.set_xlim(0, 30)
ax.set_ylim(0, 22)
ax.set_aspect('equal')
ax.axis('off')

# ============== Entity positions (center x, y) ==============
# Layout plan:
#   top-left: USER(4,18)  top-center: SHOP(12,18)  top-right: ORDER(22,18)
#   mid-left: ADDRESS(4,13)  mid: DISH(14,13)  mid-right: ORDER_ITEM(22,13)
#   bottom: CART(4,8)  CATEGORY(12,8)  REVIEW(22,8)

E = {
    'USER':       (4, 18),
    'ADDRESS':    (4, 13),
    'CART':       (4, 8),
    'SHOP':       (12, 18),
    'CATEGORY':   (12, 13),
    'DISH':       (12, 8),
    'ORDER':      (22, 18),
    'ORDER_ITEM': (22, 13),
    'REVIEW':     (22, 8),
}

# ============== Attribute offsets from entity center ==============
# Each attr: (text, dx, dy)  — relative to entity center
ATTRS = {
    'USER': [
        ('用户ID', -1.8, 0.8), ('用户名', -1.6, 0.0), ('密码', -1.8, -0.8),
        ('手机号', -0.5, 0.9), ('邮箱', 0.5, 0.9),
        ('头像', 1.8, 0.8), ('角色', 1.6, 0.0), ('状态', 1.8, -0.8),
        ('注册时间', -0.5, -0.9), ('更新时间', 1.0, -0.9),
    ],
    'ADDRESS': [
        ('地址ID', -1.8, 0.6), ('联系人', -1.6, -0.2), ('联系电话', -1.8, -0.9),
        ('省', 0.0, 0.8), ('市', 0.0, -0.8), ('区', 0.8, 0.8),
        ('详细地址', 1.8, 0.6), ('是否默认', 1.6, -0.2), ('创建时间', 1.8, -0.9),
    ],
    'CART': [
        ('购物车项ID', -1.6, 0.3), ('数量', 0.0, 0.5), ('创建时间', 1.6, 0.3),
    ],
    'SHOP': [
        ('商家ID', -2.0, 1.0), ('名称', -1.8, 0.3), ('Logo', -1.8, -0.4),
        ('简介', -1.0, 1.0), ('分类标签', -0.3, 1.0), ('联系电话', 0.5, 1.0),
        ('地址', 1.3, 1.0), ('评分', 2.0, 1.0), ('月销量', 2.0, 0.3),
        ('配送费', 2.0, -0.4), ('起送价', 2.0, -1.0),
        ('营业时间', -1.2, -0.9), ('状态', 0.0, -0.9), ('创建时间', 0.8, -0.9),
        ('更新时间', 1.6, -0.9),
    ],
    'CATEGORY': [
        ('分类ID', -1.6, 0.3), ('分类名称', -0.3, 0.5), ('排序号', 0.8, 0.5),
        ('创建时间', 1.6, 0.3),
    ],
    'DISH': [
        ('菜品ID', -2.0, 0.8), ('菜品名称', -1.8, 0.0), ('图片', -2.0, -0.8),
        ('描述', -0.8, 0.9), ('价格', 0.0, 0.9), ('原价', 0.8, 0.9),
        ('销量', 2.0, 0.8), ('库存', 1.8, 0.0), ('状态', 2.0, -0.8),
        ('创建时间', -0.8, -0.9), ('更新时间', 0.8, -0.9),
    ],
    'ORDER': [
        ('订单ID', -2.0, 1.0), ('订单编号', -1.8, 0.3), ('总价', -2.0, -0.4),
        ('配送费', -1.0, 1.0), ('状态', -0.3, 1.0), ('备注', 0.5, 1.0),
        ('支付时间', 1.3, 1.0), ('配送时间', 2.0, 1.0), ('完成时间', 2.0, 0.3),
        ('取消时间', 2.0, -0.4), ('取消原因', 2.0, -1.0),
        ('创建时间', -1.2, -0.9), ('更新时间', 0.0, -0.9),
    ],
    'ORDER_ITEM': [
        ('明细ID', -1.8, 0.5), ('菜品名称', -0.8, 0.6), ('菜品图片', 0.3, 0.6),
        ('单价', 1.5, 0.5), ('数量', -1.0, -0.6), ('小计', 1.0, -0.6),
    ],
    'REVIEW': [
        ('评价ID', -1.8, 0.5), ('评分', -0.8, 0.6), ('内容', 0.3, 0.6),
        ('图片', 1.5, 0.5), ('回复', -0.5, -0.6), ('创建时间', 1.2, -0.6),
    ],
}

# ============== Draw entities & attrs ==============
def draw_entity(ax, x, y, name):
    w, h = 1.8, 0.9
    r = FancyBboxPatch((x - w/2, y - h/2), w, h,
                       boxstyle="round,pad=0.06", fill=False,
                       edgecolor='black', linewidth=2, facecolor='white')
    ax.add_patch(r)
    ax.text(x, y, name, ha='center', va='center', fontsize=12, fontweight='bold')

def draw_attr(ax, x, y, text):
    rx, ry = max(len(text)*0.055, 0.22), 0.18
    e = Ellipse((x, y), rx*2, ry*2, fill=True,
                edgecolor='black', linewidth=1, facecolor='white')
    ax.add_patch(e)
    ax.text(x, y, text, ha='center', va='center', fontsize=7)

def line(ax, x1, y1, x2, y2, lw=1):
    ax.plot([x1, x2], [y1, y2], 'k-', linewidth=lw)

# Draw all entities and their attributes
for ename, (ex, ey) in E.items():
    draw_entity(ax, ex, ey, ename)
    for atext, dx, dy in ATTRS.get(ename, []):
        ax_x, ax_y = ex + dx, ey + dy
        draw_attr(ax, ax_x, ax_y, atext)
        line(ax, ex, ey, ax_x, ax_y, 0.8)

# ============== Relationships: (from, to, name, diamond_pos) ==============
# Diamond between entity centers, offset slightly toward midpoint
def mid(o1, o2, t=0.5):
    return (E[o1][0]*t + E[o2][0]*(1-t), E[o1][1]*t + E[o2][1]*(1-t))

def draw_rel(ax, x, y, text):
    s = 0.35
    d = Polygon([(x, y+s), (x+s*1.2, y), (x, y-s), (x-s*1.2, y)],
                fill=True, edgecolor='black', linewidth=1.5, facecolor='white')
    ax.add_patch(d)
    ax.text(x, y, text, ha='center', va='center', fontsize=9, fontweight='bold')

def rel_line(ax, x1, y1, x2, y2, card, side):
    """Draw line from entity to diamond, with cardinality."""
    # Trim to diamond edge
    dx, dy = x2 - x1, y2 - y1
    dist = np.sqrt(dx**2 + dy**2)
    if dist == 0: return
    ux, uy = dx/dist, dy/dist
    # Trim entity side
    ex1, ey1 = x1 + ux*1.0, y1 + uy*1.0
    # Trim diamond side
    ex2, ey2 = x2 - ux*0.5, y2 - uy*0.5
    ax.plot([ex1, ex2], [ey1, ey2], 'k-', linewidth=1)
    # Cardinality label
    mx, my = (ex1+ex2)/2 + side[0], (ex1+ex2)/2 + side[1]
    ax.text(mx, my, card, fontsize=8, color='red', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.05', fc='white', ec='none'))

RELS = [
    # (entity1, entity2, rel_name, card1, card2, side1, side2)
    # USER relationships
    ('USER', 'ADDRESS',  '拥有',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('USER', 'CART',     '添加',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('USER', 'ORDER',    '下单',   '1', 'n', (0.2, 0.3), (0.2, 0.3)),
    ('USER', 'REVIEW',   '发表',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    # SHOP relationships
    ('SHOP', 'CATEGORY', '包含',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('SHOP', 'DISH',     '上架',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('SHOP', 'ORDER',    '被下单', '1', 'n', (0.2, 0.3), (0.2, 0.3)),
    # CATEGORY-DISH
    ('CATEGORY', 'DISH', '归类',   '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    # DISH relationships
    ('DISH', 'CART',     '被加入', '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('DISH', 'ORDER_ITEM','被购买','1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('DISH', 'REVIEW',   '被评价', '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    # ADDRESS-ORDER
    ('ADDRESS', 'ORDER', '配送至', '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    # ORDER internal
    ('ORDER', 'ORDER_ITEM', '包含', '1', 'n', (0.2, 0.2), (0.2, 0.2)),
    ('ORDER', 'REVIEW',   '关联评价','1','1',(0.2, 0.2), (0.2, 0.2)),
]

for e1, e2, rname, c1, c2, s1, s2 in RELS:
    x1, y1 = E[e1]
    x2, y2 = E[e2]
    mx, my = (x1+x2)/2, (y1+y2)/2
    draw_rel(ax, mx, my, rname)
    rel_line(ax, x1, y1, mx, my, c1, s1)
    rel_line(ax, x2, y2, mx, my, c2, s2)

plt.tight_layout(pad=0.5)
plt.savefig('ER图.png', dpi=150, bbox_inches='tight', facecolor='white')
plt.close()
print("Done — ER图.png")
