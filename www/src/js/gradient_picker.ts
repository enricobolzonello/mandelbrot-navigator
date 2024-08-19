class GradientPicker {
    colors: string[];
    container: HTMLElement;
    preview: HTMLElement;
    addColorButton: HTMLElement;
    submitButton: HTMLElement;
    colorInput: HTMLInputElement;
    selectedColorIndex: number | null;

    constructor(
        containerId: string,
        previewId: string,
        addColorButtonId: string,
        submitButtonId: string,
        defaultColors: string[] = ["#3147AA", "#08C0F5", "#50F475", "#60F800", "#DFFB00"]
    ) {
        this.container = document.getElementById(containerId)!;
        this.preview = document.getElementById(previewId)!;
        this.addColorButton = document.getElementById(addColorButtonId)!;
        this.submitButton = document.getElementById(submitButtonId)!;

        this.colors = defaultColors;
        this.selectedColorIndex = null;

        // Create and hide the color input element
        this.colorInput = document.createElement('input');
        this.colorInput.type = 'color';
        this.colorInput.style.position = 'absolute';
        this.colorInput.style.top = '-9999px'; // Hide it off-screen
        this.colorInput.addEventListener('input', (e) => this.handleColorChange(e));

        document.body.appendChild(this.colorInput);

        this.updateUI();
        this.bindEvents();
    }

    bindEvents() {
        this.addColorButton.addEventListener('click', () => this.addColor());
        this.submitButton.addEventListener('click', () => this.submitGradient());
    }

    handleColorChange(event: Event) {
        const input = event.target as HTMLInputElement;
        const color = input.value;
        if (this.selectedColorIndex !== null) {
            this.updateColor(this.selectedColorIndex, color);
        }
    }

    addColor() {
        if (this.colors.length < 10) {
            this.colors.push('#FFFFFF');
            this.updateUI();
        }
    }

    removeColor(index: number) {
        if (this.colors.length > 2) {
            this.colors.splice(index, 1);
            this.updateUI();
        }
    }

    updateColor(index: number, color: string) {
        this.colors[index] = color;
        this.updatePreview();
    }

    updateUI() {
        this.container.innerHTML = '';

        this.colors.forEach((color, index) => {
            const colorContainer = document.createElement('div');
            colorContainer.classList.add('relative', 'w-full', 'h-14', 'border', 'border-gray-300', 'rounded-lg', 'flex', 'items-center', 'justify-center');
            colorContainer.style.backgroundColor = color;

            const colorActions = document.createElement('div');
            colorActions.classList.add('absolute', 'top-0', 'right-0', 'flex', 'gap-2', 'p-2', 'opacity-0', 'transition-opacity', 'duration-300');

            const changeButton = document.createElement('button');
            changeButton.classList.add('bg-white', 'p-1', 'rounded', 'hover:bg-blue-200');
            changeButton.innerHTML = `
                <svg class="h-4 w-4 text-neutral-500"  width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">  
                    <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />  
                    <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                </svg>
            `;
            changeButton.addEventListener('click', () => {
                this.selectedColorIndex = index;
                this.colorInput.click(); // Open the color picker
            });
            colorActions.appendChild(changeButton);

            const removeButton = document.createElement('button');
            removeButton.classList.add('bg-white', 'p-1', 'rounded', 'hover:bg-red-200');
            removeButton.innerHTML = `
                <svg class="h-4 w-4" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z"/>
                    <line x1="4" y1="7" x2="20" y2="7" />
                    <line x1="10" y1="11" x2="10" y2="17" />
                    <line x1="14" y1="11" x2="14" y2="17" />
                    <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                    <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                </svg>
            `;
            removeButton.addEventListener('click', () => this.removeColor(index));
            colorActions.appendChild(removeButton);

            colorContainer.appendChild(colorActions);

            colorContainer.addEventListener('mouseenter', () => {
                colorActions.style.opacity = '1';
            });

            colorContainer.addEventListener('mouseleave', () => {
                colorActions.style.opacity = '0';
            });

            this.container.appendChild(colorContainer);
        });

        this.updatePreview();
    }

    updatePreview() {
        this.preview.style.background = `linear-gradient(to right, ${this.colors.join(', ')})`;
    }

    submitGradient() {
        document.dispatchEvent(new CustomEvent('gradientSubmitted', { detail: this.colors }));
    }
}

export { GradientPicker };
