function CategoryPopover({ isOpen, selectedCategories, onCategoryToggle }) {
  if (!isOpen) return null;

  const categoriesList = ['Owner', 'Driver', 'Vendor'];

  return (
    <div className="category-popover show" role="menu">
      {categoriesList.map(cat => (
        <label key={cat} className="category-option">
          <input
            type="checkbox"
            value={cat}
            className="category-checkbox"
            checked={selectedCategories.includes(cat)}
            onChange={() => onCategoryToggle(cat)}
          />
          <span>{cat}</span>
        </label>
      ))}
    </div>
  );
}

window.CategoryPopover = CategoryPopover;
