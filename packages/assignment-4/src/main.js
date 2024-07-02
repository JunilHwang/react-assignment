function init() {
  var p = [
    {id: 'p1', n: '상품1', p: 10000},
    {id: 'p2', n: '상품2', p: 20000},
    {id: 'p3', n: '상품3', p: 30000}
  ];

  var a = document.getElementById('app');
  var w = document.createElement('div');
  w.className = 'bg-gray-100 p-8';
  var b = document.createElement('div');
  b.className = 'max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8';
  var h = document.createElement('h1');
  h.className = 'text-2xl font-bold mb-4';
  h.textContent = '장바구니';
  var ct = document.createElement('div');
  ct.id = 'cart-items';
  var tt = document.createElement('div');
  tt.id = 'cart-total';
  tt.className = 'text-xl font-bold my-4';
  var s = document.createElement('select');
  s.id = 'product-select';
  s.className = 'border rounded p-2 mr-2';
  var ab = document.createElement('button');
  ab.id = 'add-to-cart';
  ab.className = 'bg-blue-500 text-white px-4 py-2 rounded';
  ab.textContent = '추가';

  for (var j = 0; j < p.length; j++) {
    var o = document.createElement('option');
    o.value = p[j].id;
    o.textContent = p[j].n + ' - ' + p[j].p + '원';
    s.appendChild(o);
  }

  b.appendChild(h);
  b.appendChild(ct);
  b.appendChild(tt);
  b.appendChild(s);
  b.appendChild(ab);
  w.appendChild(b);
  a.appendChild(w);

  ab.onclick = function() {
    var v = s.value;
    var i;
    for (var k = 0; k < p.length; k++) {
      if (p[k].id === v) {
        i = p[k];
        break;
      }
    }
    if (i) {
      var e = document.getElementById(i.id);
      if (e) {
        var q = parseInt(e.querySelector('span').textContent.split('x ')[1]) + 1;
        e.querySelector('span').textContent = i.n + ' - ' + i.p + '원 x ' + q;
      } else {
        var d = document.createElement('div');
        d.id = i.id;
        d.className = 'flex justify-between items-center mb-2';
        var sp = document.createElement('span');
        sp.textContent = i.n + ' - ' + i.p + '원 x 1';
        var bd = document.createElement('div');
        var mb = document.createElement('button');
        mb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        mb.textContent = '-';
        mb.dataset.productId = i.id;
        mb.dataset.change = '-1';
        var pb = document.createElement('button');
        pb.className = 'quantity-change bg-blue-500 text-white px-2 py-1 rounded mr-1';
        pb.textContent = '+';
        pb.dataset.productId = i.id;
        pb.dataset.change = '1';
        var rb = document.createElement('button');
        rb.className = 'remove-item bg-red-500 text-white px-2 py-1 rounded';
        rb.textContent = '삭제';
        rb.dataset.productId = i.id;
        bd.appendChild(mb);
        bd.appendChild(pb);
        bd.appendChild(rb);
        d.appendChild(sp);
        d.appendChild(bd);
        ct.appendChild(d);
      }
      var t = 0;
      var items = ct.children;
      for (var m = 0; m < items.length; m++) {
        var item;
        for (var n = 0; n < p.length; n++) {
          if (p[n].id === items[m].id) {
            item = p[n];
            break;
          }
        }
        var quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1]);
        t += item.p * quantity;
      }
      tt.textContent = '총액: ' + t + '원';
    }
  };

  ct.onclick = function(event) {
    var target = event.target;
    if (target.classList.contains('quantity-change')) {
      var productId = target.dataset.productId;
      var change = parseInt(target.dataset.change);
      var item = document.getElementById(productId);
      var quantity = parseInt(item.querySelector('span').textContent.split('x ')[1]) + change;
      if (quantity > 0) {
        item.querySelector('span').textContent = item.querySelector('span').textContent.split('x ')[0] + 'x ' + quantity;
      } else {
        item.remove();
      }
      var t = 0;
      var items = ct.children;
      for (var m = 0; m < items.length; m++) {
        var item;
        for (var n = 0; n < p.length; n++) {
          if (p[n].id === items[m].id) {
            item = p[n];
            break;
          }
        }
        var quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1]);
        t += item.p * quantity;
      }
      tt.textContent = '총액: ' + t + '원';
    } else if (target.classList.contains('remove-item')) {
      var productId = target.dataset.productId;
      document.getElementById(productId).remove();
      var t = 0;
      var items = ct.children;
      for (var m = 0; m < items.length; m++) {
        var item;
        for (var n = 0; n < p.length; n++) {
          if (p[n].id === items[m].id) {
            item = p[n];
            break;
          }
        }
        var quantity = parseInt(items[m].querySelector('span').textContent.split('x ')[1]);
        t += item.p * quantity;
      }
      tt.textContent = '총액: ' + t + '원';
    }
  };
}

init();
