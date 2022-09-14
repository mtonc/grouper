import GroupsService from "./groups.service.js";

class ElementFactory {
	#index;
	constructor(index = 0) {
		this.#index = index;
	}

	#createInput = (inputType, classStr = "", val = "", placeholder = "") => {
		const input = document.createElement("input");
		input.type = inputType;
		input.className = classStr;
		input.value = val;
		input.placeholder = placeholder;
		return input;
	};

	#createTd = (element, classStr = "") => {
		const td = document.createElement("td");
		td.className = classStr;
		td.appendChild(element);
		return td;
	};

	#createRow = (children, index) => {
		const tr = document.createElement("tr");
		// tr.className = 'row';
		tr.dataset.index = index;
		children.forEach((td) => {
			if (td.tagName === "TD") {
				tr.appendChild(td);
			}
		});
		return tr;
	};

	#createOption = (value, selected = false) => {
		const option = document.createElement("option");
		option.text = option.value = value;
		option.selected = selected;
		return option;
	};

	#createSelect = (classStr = "", selected = "") => {
		const select = document.createElement("select");
		select.className = classStr;
		GroupsService.colors.forEach((c) => {
			select.appendChild(this.#createOption(c, c === selected));
		});
		return select;
	};

	#createRemoveButton = (classStr = "") => {
		const button = document.createElement("button");
		button.type = "button";
		button.className = classStr;
		button.dataset.index = this.#index;
		button.innerText = "x";
		return button;
	};

	createGroupInputs({ name = "", url = "", color = "grey" }, table) {
		const tds = [
			this.#createTd(
				this.#createInput(
					"url",
					"url-input form-input",
					url,
					"http://example.com"
				),
				"form-group"
			),
			this.#createTd(
				this.#createInput("text", "name-input form-input", name, "Reddit"),
				"form-group"
			),
			this.#createTd(
				this.#createSelect("color-input form-select ", color),
				"form-group"
			),
			this.#createTd(
				this.#createRemoveButton(
					"remove-btn btn btn-action s-circle",
					this.#index
				)
			),
		];
		const newRow = this.#createRow(tds, this.#index);
		table.appendChild(newRow);
		this.#index += 1;
	}
}

export default ElementFactory;
