let cart = [];
let modalQt = 1;
let modalkey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

pizzaJson.map((item, index) => {
  let pizzaItem = c(".models .pizza-item").cloneNode(true);
  pizzaItem.dataset.key = index
  currentPrice = item.prices[2].toFixed(2)

  pizzaItem.querySelector(".pizza-item--img img").src = item.img;
  pizzaItem.querySelector(".pizza-item--price").innerHTML = `R$ ${currentPrice}`;
  pizzaItem.querySelector(".pizza-item--name").innerHTML = item.name;
  pizzaItem.querySelector(".pizza-item--desc").innerHTML = item.description;
  pizzaItem.querySelector("a").addEventListener("click", (e) => {
    e.preventDefault();
    
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    
    modalKey = item.id
  
    c(".pizzaBig img").src = pizzaJson[key].img;
    c(".pizzaInfo h1").innerHTML = pizzaJson[key].name;
    c(".pizzaInfo--desc").innerHTML = pizzaJson[key].description;
    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${currentPrice}`;
    c(".pizzaInfo--size.selected").classList.remove("selected");
    cs(".pizzaInfo--size").forEach((size, sizeIndex) => {
      if (sizeIndex == 2) {
        size.classList.add("selected");
      }
      size.querySelector("span").innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c(".pizzaInfo--qt").innerHTML = modalQt;

    c(".pizzaWindowArea").style.opacity = 0;
    c(".pizzaWindowArea").style.display = "flex";
    setTimeout(() => {
      c(".pizzaWindowArea").style.opacity = 1;
    }, 200);
  });

  c(".pizza-area").append(pizzaItem);
});
//Parte do Modal

function closeModal() {
  c(".pizzaWindowArea").style.opacity = 0;
  setTimeout(() => {
    c(".pizzaWindowArea").style.display = "none";
  }, 500);
}
cs(".pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton").forEach(
  (item) => {
    item.addEventListener("click", closeModal);
  }
);

c('.pizzaInfo--qtmenos').addEventListener('click',()=>{
  if(modalQt > 1){
    modalQt--;
    c('.pizzaInfo--qt').innerHTML = modalQt;
  }
  
});
c('.pizzaInfo--qtmais').addEventListener('click',()=>{
  modalQt++;
  c('.pizzaInfo--qt').innerHTML = modalQt;
});

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (e)=>{
    c('.pizzaInfo--size.selected').classList.remove('selected');
    size.classList.add('selected');

    selectedSize = size.dataset.key
    selectedPizza = pizzaJson.find(el => { return el.id === modalKey})
    selectedPrice = selectedPizza.prices[selectedSize]

    c(".pizzaInfo--actualPrice").innerHTML = `R$ ${selectedPrice.toFixed(2)}`;

  })
});

c('.pizzaInfo--addButton').addEventListener('click',()=>{
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

  let identifier = pizzaJson[modalkey].id+'@'+size;
  console.log(identifier)

  let key = cart.findIndex((item)=>item.identifier == identifier);

  if(key > -1){
    cart[key].qt += modalQt;
  }else{
    cart.push({
      identifier,
      id:pizzaJson[modalkey].id,
      size,
      qt:modalQt
    })
  };

  console.log(cart)

  updateCart();
  closeModal();

});


c('.menu-openner').addEventListener('click',()=>{
    if(cart.length > 0){
      c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click',()=>{
  c('aside').style.left = '100vw';
});

function updateCart(){
  c('.menu-openner span').innerHTML = cart.length;
  console.log(cart)

  if(cart.length > 0){
    c('aside').classList.add('show');
    c('.cart').innerHTML = '';

    let subtotal = 0;
    let desconto = 0;
    let total = 0;

    for(let i in cart){
      id = cart[i].id
      size = cart[i].size
      qt = cart[i].qt

      let pizzaItem = pizzaJson.find((item)=>item.id == id);

      subtotal += pizzaItem.prices[size] * qt;

      let cartItem = c('.models .cart--item').cloneNode(true);

      let pizzaSizeName;
      switch(cart[i].size){
        case 0:
          pizzaSizeName = 'P';
          break;
        case 1:
          pizzaSizeName = 'M';
          break;
        case 2:
          pizzaSizeName = 'G';
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;
      cartItem.querySelector('img').src = pizzaItem.img;
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click' , ()=>{
        if(cart[i].qt > 1){
          cart[i].qt--;
        }else{
            cart.splice(i, 1);
        }
        updateCart();
      });
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click' , ()=>{
        cart[i].qt++;
        updateCart();
      });

      c('.cart').append(cartItem);
    }

    desconto = subtotal * 0.1;
    total = subtotal - desconto;

    c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
    c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
    c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;


  }else{
    c('aside').classList.remove('show');
    c('aside').style.left = '100vw';
  }
}