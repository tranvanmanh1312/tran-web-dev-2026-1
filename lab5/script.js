const selectedDishes = {
    soup: undefined,
    main: undefined,
    salad: undefined,
    drink: undefined,
    dessert: undefined,
};

const activeFilters = {
    soup: undefined,
    main: undefined,
    salad: undefined,
    drink: undefined,
    dessert: undefined,
};

const categorySettings = {
    soup: {
        containerId: "soups",
        textId: "selected-soup",
        inputId: "soup-keyword",
        emptyText: "Блюдо не выбрано",
    },
    main: {
        containerId: "main-courses",
        textId: "selected-main",
        inputId: "main-keyword",
        emptyText: "Блюдо не выбрано",
    },
    salad: {
        containerId: "salads",
        textId: "selected-salad",
        inputId: "salad-keyword",
        emptyText: "Блюдо не выбрано",
    },
    drink: {
        containerId: "drinks",
        textId: "selected-drink",
        inputId: "drink-keyword",
        emptyText: "Напиток не выбран",
    },
    dessert: {
        containerId: "desserts",
        textId: "selected-dessert",
        inputId: "dessert-keyword",
        emptyText: "Десерт не выбран",
    },
};

function formatDishText(dish) {
    return `${dish.name} ${dish.price} ₽`;
}

function updateOrderCategory(category) {
    const settings = categorySettings[category];
    const textElement = document.getElementById(settings.textId);
    const dish = selectedDishes[category];

    if (dish === undefined) {
        textElement.textContent = settings.emptyText;
        return;
    }

    textElement.textContent = formatDishText(dish);
}

function updateHiddenInputs() {
    Object.keys(categorySettings).forEach((category) => {
        const settings = categorySettings[category];
        const input = document.getElementById(settings.inputId);
        const dish = selectedDishes[category];

        input.value = dish === undefined ? "" : dish.keyword;
    });
}

function updateSelectedCards() {
    document.querySelectorAll(".dish-card").forEach((card) => {
        const dish = dishes.find((item) => {
            return item.keyword === card.dataset.dish;
        });

        if (dish === undefined) {
            return;
        }

        const selected = selectedDishes[dish.category];
        const isSelected = selected !== undefined
            && selected.keyword === dish.keyword;

        card.classList.toggle("selected", isSelected);
    });
}

function updateTotal() {
    const totalBlock = document.getElementById("order-total");
    const totalPrice = document.getElementById("total-price");

    const total = Object.values(selectedDishes).reduce(
        (sum, dish) => {
            return dish === undefined ? sum : sum + dish.price;
        },
        0
    );

    totalPrice.textContent = total;
    totalBlock.classList.toggle("hidden", total === 0);
}

function renderOrder() {
    const nothingSelected = document.getElementById(
        "nothing-selected"
    );
    const selectedItems = document.getElementById("selected-items");

    const hasSelectedDish = Object.values(selectedDishes).some(
        (dish) => dish !== undefined
    );

    nothingSelected.classList.toggle("hidden", hasSelectedDish);
    selectedItems.classList.toggle("hidden", !hasSelectedDish);

    Object.keys(categorySettings).forEach((category) => {
        updateOrderCategory(category);
    });

    updateHiddenInputs();
    updateSelectedCards();
    updateTotal();
}

function selectDish(dish) {
    selectedDishes[dish.category] = dish;
    renderOrder();
}

function handleAddButton(event) {
    const card = event.currentTarget.closest(".dish-card");
    const keyword = card.dataset.dish;

    const dish = dishes.find((item) => {
        return item.keyword === keyword;
    });

    if (dish !== undefined) {
        selectDish(dish);
    }
}

function createDishCard(dish) {
    const card = document.createElement("div");
    card.className = "dish-card";
    card.dataset.dish = dish.keyword;

    const image = document.createElement("img");
    image.src = dish.image;
    image.alt = dish.name;
    image.width = 600;
    image.height = 400;

    const price = document.createElement("p");
    price.className = "dish-price";
    price.textContent = `${dish.price} ₽`;

    const name = document.createElement("p");
    name.className = "dish-name";
    name.textContent = dish.name;

    const count = document.createElement("p");
    count.className = "dish-weight";
    count.textContent = dish.count;

    const button = document.createElement("button");
    button.className = "add-button";
    button.type = "button";
    button.textContent = "Добавить";
    button.addEventListener("click", handleAddButton);

    card.append(image, price, name, count, button);

    return card;
}

function getCategoryDishes(category) {
    const currentFilter = activeFilters[category];

    return dishes
        .filter((dish) => {
            const sameCategory = dish.category === category;

            if (currentFilter === undefined) {
                return sameCategory;
            }

            return sameCategory && dish.kind === currentFilter;
        })
        .sort((first, second) => {
            return first.name.localeCompare(second.name, "ru");
        });
}

function renderCategory(category) {
    const settings = categorySettings[category];
    const container = document.getElementById(settings.containerId);

    container.innerHTML = "";

    getCategoryDishes(category).forEach((dish) => {
        container.append(createDishCard(dish));
    });

    updateSelectedCards();
}

function renderDishes() {
    Object.keys(categorySettings).forEach((category) => {
        renderCategory(category);
    });
}

function setFilterButtonState(filtersBlock, activeKind) {
    filtersBlock.querySelectorAll("[data-kind]").forEach((button) => {
        const isActive = button.dataset.kind === activeKind;
        button.classList.toggle("active", isActive);
    });
}

function handleFilterClick(event) {
    const button = event.target.closest("[data-kind]");

    if (button === null) {
        return;
    }

    const filtersBlock = button.closest(".filters");
    const category = filtersBlock.dataset.category;
    const kind = button.dataset.kind;
    const currentFilter = activeFilters[category];

    if (currentFilter === kind) {
        activeFilters[category] = undefined;
    } else {
        activeFilters[category] = kind;
    }

    setFilterButtonState(
        filtersBlock,
        activeFilters[category]
    );
    renderCategory(category);
}

function connectFilters() {
    document.querySelectorAll(".filters").forEach((filtersBlock) => {
        filtersBlock.addEventListener("click", handleFilterClick);
    });
}

function resetOrder() {
    Object.keys(selectedDishes).forEach((category) => {
        selectedDishes[category] = undefined;
    });

    renderOrder();
}

function handleFormReset() {
    resetOrder();
}

const orderForm = document.querySelector(".order-form");

renderDishes();
renderOrder();
connectFilters();
orderForm.addEventListener("reset", handleFormReset);
