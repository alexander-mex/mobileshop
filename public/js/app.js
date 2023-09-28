const parseDate = date => {
  return new Intl.DateTimeFormat('uk-UK', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date));
};

document.querySelectorAll('.date').forEach(el => {
  el.textContent = parseDate(el.textContent);
});

// Получите элементы кнопок и номеров страниц
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
const pageNumbers = document.querySelectorAll('.page-number a');
const urlParams = new URLSearchParams(window.location.search);
const currentPage = parseInt(urlParams.get('page')) || 1;

// Обработчик клика на номер страницы
pageNumbers.forEach((pageNumber) => {
  pageNumber.addEventListener('click', (event) => {
    event.preventDefault();
    const targetPage = parseInt(event.target.textContent);
    window.location.href = `/phones?page=${targetPage}`;
  });
});

// Сортировка

// const sortSelect = document.getElementById('sort');
// sortSelect.addEventListener('change', function() {
//   const selectedSortOption = sortSelect.value;
  
//   const filterForm = document.querySelector('form[action="/phones/sort"]');
  
//   filterForm.querySelector('input[name="sort"]').value = selectedSortOption;
  
//   filterForm.submit();
// });

// Кнопка "Удалить"
const cart = document.querySelector('#cart');
if (cart) {
  cart.addEventListener('click', e => {
    if (e.target.classList.contains('btn-remove')) {
      const id = e.target.dataset.id;
      const csrf = e.target.dataset.csrf;
      fetch('/cart/remove/' + id, { method: 'delete', headers: { 'X-XSRF-TOKEN': csrf } })
        .then(res => res.json())
        .then(basket => {
          if (basket.phones.length) {
            const html = basket.phones
              .map(p => {
                return `
                  <tr>
                    <td>${p.title}</td>
                    <td>${p.count}</td>
                    <td style="white-space:nowrap;">${p.price.toLocaleString('uk-UA')} грн.</td>
                    <td>
                      <button class="btn btn-delete btn-remove" data-csrf="${csrf}" data-id="${p._id}">Видалити</button>
                    </td>
                  </tr>
                `;
              })
              .join('');
            cart.querySelector('tbody').innerHTML = html;
            cart.querySelector('.basket-price span').textContent = basket.price.toLocaleString('uk-UA');
          } else {
            cart.innerHTML = `
              <div class="basket-empty">
                <p>У кошику нічого немає</p>
                <img src="/img/empty-cart.png" />
                <a class="btn btn-primary" href="/phones">Обрати свій телефон</a>
              </div>
            `;
          }
        })
        .catch(error => {
          console.error('Error removing phone from cart:', error);
        });
    }
  });
}