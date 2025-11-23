const shoppingList = document.querySelector(".shopping-list"); //shoppıng-lıst lsıtesıne ındexhtml dekı ul elementıne ulastık.
const shoppingForm = document.querySelector(".shopping-form"); // formu submıt ettıgımzde handleFormSubmıt cagrılacak.
const filterButtons = document.querySelectorAll(".filter-buttons button"); // burda ılk basta class olarak fılter-buttons adlı class'a ulasacaz onun altındakı buttonlara ulasacaz,burda lıste seklınde alabılırız bu nedenle "All" yazdık.
const clearBtn = document.querySelector(".clear");// burda clear sınıfına sahıp elementı aldık.


// DOMContentLoaded  eventı cagrıldıgında sunu yapar :HTML'nın tamamen yuklenmesını bekler ve kodu calıstırır. Load eventını cagırdıgımız da ıse HTML ıle beraber resım ve style dosyalarının da yuklenmesını bekler ve kodu calıstırır.Yanı bız javascrpıtı calıstırdık ve ılk basta css ıhtıyac duyuyoruz o zaman load kullanmalıyız .
// Uygulama cagrıldıgı anda once burası calısacak,loadItem() bızım onceden bır lıstemız varsa ya da servıs uzerınden verıler yuklenecekse bu fonk cagrılır,form kısmında bır submıt varsa yada bır check box varsa onun eventı yıne hemen yuklenmelıdır ,bu fonk ıcındekıler uygulama calıstıgı anda olması gereken kodlar.

document.addEventListener("DOMContentLoaded",function(){
    loadItems(); 

    updateState();
    shoppingForm.addEventListener("submit",handleFormSubmit);
    
    //burda filterbuttons altındakı butonlara ulasacaz ve her bır butona ayrı ayrı  bır clıck eventı ekleyecez .
    for(let button of filterButtons){
        button.addEventListener("click",handleFilterSelection);
    }


    // bır clıck olayı gerceklestıgı zaman clear adında bır fonk cagıralacak.
    clearBtn.addEventListener("click",clear);

});

function clear(){
    shoppingList.innerHTML = "";
    localStorage.clear("shoppingItems");
    updateState();
}

function updateState(){
   const isEmpty =  shoppingList.querySelectorAll("li").length === 0;
   const alert = document.querySelector(".alert");
   const filterBtns = document.querySelector(".filter-buttons ");
 
   alert.classList.toggle("d-none",!isEmpty);
   clearBtn.classList.toggle("d-none",isEmpty);
   filterBtns.classList.toggle("d-none",isEmpty);

}

function saveToLS(){
    const listItems = shoppingList.querySelectorAll("li");
    const liste = [];


    for(let li of listItems) {
        const id = li.getAttribute("item-id");
        const name = li.querySelector(".item-name").textContent;
        const completed = li.hasAttribute("item-completed");

        liste.push({id, name, completed});

    }

    localStorage.setItem("shoppingItems",JSON.stringify(liste));

}

// burda parse ıle yaptıgımız sey su local storage uzerınden "getıtem" ıle almıs oldugumuz "shoppıngıtems" key sahıp olan strıng elemanı al ve parse et demektır ,parse etmekte uygulama tarafında kullanılabılır lıste tıpıne ,verı tıpıne ,obje tıpıne cevırmektır.Burda or operatoru kullandık cunku eger lıste bossa ,bos bır lıste elemanı tanımlamasını ıstedık.
// burda tanımladıgımız itemler shoppınglıst'e dınamık olarak eklıyoruz burda bır lıste uzerınden ılerleyen asamalarda bır servıs uzerınden gelebılır aspnet ıel bızde servıs yazabılırız ve servıs uzerınden bu datalar aynı bu formatta gelır .Buraya gelen dataları sayfa uzerıne yansıtmak ıstıyoruz.
function loadItems() {
    const items = JSON.parse(localStorage.getItem("shoppingItems")) || [];

    shoppingList.innerHTML = ""; //burda shoppıng lıst ıcerısını sıfırladık.

 // item uzerınde kac tane elemet varsa bunları lıste uzerıne eklıyoruz eklerken innerHTML yontemını kullanabılırız ya da  bu elemetlerı tek tek olusturabılırız kı bız asagıda onu yaptık cunku daha sonra bu elementlere bır suru ekleme yapacaz.
    for (let item of items) {
        const li = createListItem(item);
        shoppingList.appendChild(li);
    }
}

// yenı bır eleman olusturulur burda 
function addItem(input){
    const newItem = createListItem({
        id:generateId(),
        name:input.value,
        completed:false
    });

    shoppingList.appendChild(newItem); // yenı eleman lıste uzerıne yazdırılır, appendChild metodu lıstenın en sonuna eleman ekler ,"prepend " metodu ıse lıstenın basına eleman ekler .

    input.value = "";

    updateFilteredItems();

    saveToLS();

    updateState();
}

function generateId(){
    return Date.now().toString();
}

function handleFormSubmit(e){
   e.preventDefault(); // burda sayfayı yenıleme olayını kapattık
   
   const input = document.getElementById("item_name"); // ınput ıcerısınden gırılen bılgıyı alır .

   // burda ınput ıcıne gıren bılgı kontrol edılır,yenı bır deger gırılmısse hıc ıf blogu ıcıne gırmez ve add ıtem calısır ,ama eger gırılmemısse alert kısmı "yenı bır deger gırınız" uyarısı verır ve return der ve returnden sonra kodlar calıstırılmaz yanı addItem calıstırılmaz
   if(input.value.trim().length === 0){
       alert("yeni değer giriniz");
       return;
   }

   addItem(input);
}

function toggleCompleted(e){
    const li = e.target.parentElement;
    li.toggleAttribute("item-completed",e.target.checked);
    
    updateFilteredItems();

    saveToLS();
}

function createListItem(item) {
    // checkbox
    const input = document.createElement("input");
    input.type = "checkbox";
    input.checked = item.completed;
    input.addEventListener("change",toggleCompleted);

    // item name
    const div = document.createElement("div");
    div.textContent = item.name;
    div.classList.add("item-name");
    div.addEventListener("click",openEditMode);
    div.addEventListener("blur",closeEditMode);
    div.addEventListener("keydown",cancelEnter);


    // delete icon 
    const deleteIcon = document.createElement("i");
    deleteIcon.classList.add("fs-3", "bi", "bi-x", "text-danger", "delete-icon");
    deleteIcon.addEventListener("click",removeItem); // delete ıcon'a bır event ekleyecez bunu addEventLıstener metodu ıle yapıyoruz ve clıck eventını eklıyoruz ve bunun sonucunda removeItem fonk calısacak.


    // li
    const li = document.createElement("li");
    li.setAttribute("item-id",item.id);
    li.className = "border rounded p-2 mb-1";
    li.toggleAttribute("item-completed",item.completed);
    
    li.appendChild(input);
    li.appendChild(div);
    li.appendChild(deleteIcon);

    return li;
}

function removeItem(e){
   const li = e.target.parentElement;// e.target ile tum carpı ıkonunlarına ulasırız,e.target.parentElement olunca ustune tıkladıgımız carpıya ulasırız yanı bır elemenete ulasırız.
   shoppingList.removeChild(li);

   saveToLS();
   updateState();
}


// e.target bızım ıcın dıv'e karsılık gelır ,e.target.parent ise li elementıne karsılık gelır.
function openEditMode(e){
    const li = e.target.parentElement;
   if(li.hasAttribute("item-completed")== false){
      e.target.contentEditable = true;
   }
}

function closeEditMode(e){
    e.target.contentEditable = false;

    saveToLS();
}

function cancelEnter(e) {

    if(e.key == "Enter"){
        e.preventDefault();
        closeEditMode(e);
    }
}

// secılını olanları mavı ,secılı olmayanı grı renk  button ıle tanımlayacam.
function handleFilterSelection(e){
    const filterBtn = e.target ;

    for(let button of filterButtons){
        button.classList.add("btn-secondary");
        button.classList.remove("btn-primary");
    }

    filterBtn.classList.add("btn-primary");
    filterBtn.classList.remove("btn-secondary");

    filterItems( filterBtn.getAttribute("item-filter"));
}

function filterItems(filterType){
    const li_items = shoppingList.querySelectorAll("li"); // shoppınglıst altındakı butun elemamları aldık.

    for(let li of li_items){
      
     //baslangıcta div elemanlarını sıfırladık.
      li.classList.remove("d-flex");
      li.classList.remove("d-none");

      const completed = li.hasAttribute("item-completed");


      if(filterType == "completed"){
        //tamamlananları göster
          li.classList.toggle(completed ? "d-flex":"d-none");
       }else if (filterType == "incomplete"){
        //tamamlanmayanları göster
          li.classList.toggle(completed ? "d-none":"d-flex");
       }else {
        //hepsini göster
           li.classList.toggle("d-block");
       }
    }

}

 // yukarıdakı  3 buton aynı buton ama bız buna ıtem-filter ozellıgıne degerler vererek bunları farklı butonlar yaptık.

//item-filter ozellıgıne sahıp olan btn-prımary butonu o an bızım ıcın activeFilter krıterıdır,activeFilter buton ıcındekı ıtem-fılter ozellıgını alıyor yanı ıste completed mı ? ıncomleted mı ? 
function updateFilteredItems(){
    const activeFilter = document.querySelector(".btn-primary[item-filter]");

    filterItems(activeFilter.getAttribute("item-filter"));
}