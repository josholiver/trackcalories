// Storage Controller
const StorageCtrl = (function(){
    // Public methods
    return {   
        storeItem : function(item){
            let items;
            // check if any items in ls
            if(localStorage.getItem('items') === null){
                items = [];
                // push the new item
                items.push(item);
                // set ls
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                // retrieve from LS
                items = JSON.parse(localStorage.getItem('items'));
                
                // Push the new item
                items.push(item);
                // re-set ls
                localStorage.setItem('items', JSON.stringify(items));

            }
        },
        getItemsFromStorage: function(){
            let items;
            if(localStorage.getItem('items') === null){
                items = [];
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }
            return items;
        },
        updateItemStorage: function(updatedItem){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(updatedItem.id === item.id){
                    items.splice(index,1, updatedItem);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        deleteFromStorage: function(id){
            let items = JSON.parse(localStorage.getItem('items'));
            items.forEach(function(item,index){
                if(id === item.id){
                    items.splice(index,1);
                }
            });
            localStorage.setItem('items', JSON.stringify(items));
        },
        clearItemsFromStorage: function(){
            localStorage.removeItem('items');
        }

    }
})();


// Item Controller
const ItemCtrl = (function() {
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.calories = calories;
    this.name = name;
  };

  // Data Structure or the State
  const data = {
    // items: [
    //     // { id: 0, name: 'Steak Dinner', calories: 1200 },
    //     // { id: 1, name: 'Cookie', calories: 400 },
    //     // { id: 2, name: 'Eggs', calories: 500 }
    // ],
    items: StorageCtrl.getItemsFromStorage(),
    currentItem: null,
    totalCalories: 0
  }
  //Public Methods
  return{
        getItems: function(){
            return data.items;
        },
        addItem: function(name,calories){
            let ID;
            // Create ID
            if(data.items.length > 0){
                ID = data.items[data.items.length - 1].id + 1;
            }else{
                ID = 0;
            }
            // Calories to number
            calories = parseInt(calories);

            // Create new item
            newItem = new Item(ID,name,calories);
            // Add to items array
            data.items.push(newItem);

            return newItem;
        },
        getItemById: function(id){
            let found = null;
            // loop through items
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        }, 
        updateItem: function(name,calories){
            //turn calories to number
            calories = parseInt(calories);
            let found = null;
            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        deleteItem: function(id){
            // get id's 
            const ids = data.items.map(function(item){
                return item.id;
            });
            // get index
            const index = ids.indexOf(id);
            // remove items
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
        },

        getCurrentItem: function(){
            return data.currentItem;
        },

        getTotalCalories: function(){
            let total = 0;
            // Loop through items and add calories
            data.items.forEach(function(item){
                total += item.calories;
            });
            // Set total calories in data structure
            data.totalCalories = total;

            // return total calories
            return data.totalCalories;
        },

        logData: function(){
            return data;
        }
    }
})();

// UI controller
const UICtrl = (function() {

    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
        
    }

    // Public Methods
    return{
        populateItemList: function(items){
            let html = '';

            // items.forEach(function(item){
            //     html += `<li class="collection-item" id="${item.id}">
            //     <strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
            //     <a href="#" class="secondary-content">
            //         <i class="edit-item fa fa-pencil"></i>
            //     </a>
            //     </li>`;
            // });

            items.forEach(function(item){
                html += `<li class="collection-item" id="item-${item.id}">
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
              </li>`;
              });

            // Insert List items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        addListItem:function(item){
            // show list item
            document.querySelector(UISelectors.itemList).style.display ='block';

            // Create li element
            const li = document.createElement('li');
            // add a class
            li.className = 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML = `<strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fa fa-pencil"></i>
            </a>`;
            //insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn nodelist into array
            listItems = Array.from(listItems);
            listItems.forEach(function(listItem){
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`){
                    document.querySelector(`#${itemID}`).innerHTML = `<strong> ${item.name}:</strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>`;
                }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function(){
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        }, 
        addItemToFrom: function(){
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // turn NodeList into array
            listItems = Array.from(listItems);
            listItems.forEach(function(item){
                item.remove();
            });
        },
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        }, 
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        getSelectors: function(){
            return UISelectors;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, StorageCtrl,UICtrl) {

    // Load event listeners
    const loadEventListeners = function(){
        // Get UI Selectors
        const UISelectors = UICtrl.getSelectors();
        // Add item event
        document.querySelector(UISelectors.addBtn).addEventListener('click',itemAddSubmit);
        // Disable submit on enter
        document.addEventListener('keypress', function(e){
            if(e.keyCode === 13||e.which === 13){
                e.preventDefault();
                return false; 
            }
        });
        // Edit on icon click
        document.querySelector(UISelectors.itemList).addEventListener('click',itemEditClick);
        // Update item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click',itemUpdateSubmit);
        // Update item event
        document.querySelector(UISelectors.backBtn).addEventListener('click',UICtrl.clearEditState);
        // Delete item event
        document.querySelector(UISelectors.deleteBtn).addEventListener('click',itemDeleteSubmit);
        // Clear button eent
        document.querySelector(UISelectors.clearBtn).addEventListener('click',clearAllItemsClick);
    }

    // Add item submit
    const itemAddSubmit = function(e){
        // Get Form Input from UI controller
        const input = UICtrl.getItemInput();
        
        // Check for name and calorie input
        if(input.name !== '' && input.calories !== ''){
            // Add item
            const newItem = ItemCtrl.addItem(input.name,input.calories);

            // add item to UI list
            UICtrl.addListItem(newItem);

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // Store in local Storage
            StorageCtrl.storeItem(newItem);

            // Clear fields
            UICtrl.clearInput();
        }
        e.preventDefault();
    }

    // click edit item
    const itemEditClick = function(e){
        // event delegation is used here because this icon is not loaded on the initial DOM load..
        if(e.target.classList.contains('edit-item')){
            // get the list item ID (item-0, item-1)
            const listId = e.target.parentNode.parentNode.id;
            
            // Break into an array
            const listIdArr = listId.split('-');
            // Get the actual id
            const id = parseInt(listIdArr[1]);

            // Get item
            const itemToEdit = ItemCtrl.getItemById(id);+
            
            // set current item
            ItemCtrl.setCurrentItem(itemToEdit);

            // Add item to from
            UICtrl.addItemToFrom();
        }
        e.preventDefault();
    }

    // Update item submit
    const itemUpdateSubmit = function(e){
        // Get item input
        const input = UICtrl.getItemInput();
        // update item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        
        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Update local storage
        StorageCtrl.updateItemStorage(updatedItem);
        UICtrl.clearEditState();
        
        e.preventDefault();
    }

    // delete button event
    const itemDeleteSubmit = function(e){
        // get current item
        const currentItem = ItemCtrl.getCurrentItem();
        // Delete from data structure
        ItemCtrl.deleteItem(currentItem.id);
        
        // delete from UI
        UICtrl.deleteListItem(currentItem.id);

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Delete from local storage
        StorageCtrl.deleteFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    // Clear Items Event
    const clearAllItemsClick = function(){
        // Delete all items from data structures
        ItemCtrl.clearAllItems();

        // Get total Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);

        // Remove from UI
        UICtrl.removeItems();

        // Clear from local storage
        StorageCtrl.clearItemsFromStorage();

        // hide the UL
        UICtrl.hideList();

    }
    //Public methods
    return{
        init: function(){
            // Clear edit state / set Initial state
            UICtrl.clearEditState();

            // Fetch Items from the data Structure
            const items = ItemCtrl.getItems();
            
            //check if any items
            if(items.length === 0){
                UICtrl.hideList();
            } else{
                // Populate list with items
                UICtrl.populateItemList(items);
            }

            // Get total Calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            
            // Load Event listeners
            loadEventListeners();
        }
    }
})(ItemCtrl, StorageCtrl,UICtrl);

// Initialize App
App.init();
