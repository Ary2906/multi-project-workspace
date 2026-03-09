export const CRUDSection = ({
  label,
  items,
  inputValue,
  editMode,
  editValue,
  listName,
  onInputChange,
  onEditValueChange,
  onAdd,
  onDelete,
  onStartEdit,
  onUpdateItem,
  onCancelEdit
}) => {
  // Helper function to get display value from item
  const getItemValue = (item) => {
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item.name) return item.name;
    return '';
  };

  return (
    <div className="crud-section">
      <h3 className="crud-section-title">{label}</h3>
      
      <div className="crud-input-group">
        <input
          type="text"
          placeholder={`Add new ${listName.replace(/([A-Z])/g, ' $1').toLowerCase()}...`}
          value={inputValue}
          onChange={(e) => onInputChange(e, listName)}
          onKeyPress={(e) => e.key === 'Enter' && onAdd(listName)}
          className="crud-input"
        />
        <button
          type="button"
          className="crud-add-btn"
          onClick={() => onAdd(listName)}
          title="Add new item"
        >
          <span className="plus-icon">+</span> Add
        </button>
      </div>

      <div className="crud-list-container">
        {items.length === 0 ? (
          <div className="crud-empty-state">
            <p>No items yet. Add one to get started!</p>
          </div>
        ) : (
          <div className="crud-items">
            {items.map((item, index) => (
              <div key={index} className="crud-item-card">
                {editMode === index ? (
                  <div className="crud-item-edit-mode">
                    <input
                      type="text"
                      className="crud-item-edit-input"
                      value={editValue}
                      onChange={(e) => onEditValueChange(e, listName)}
                      onKeyPress={(e) => e.key === 'Enter' && onUpdateItem(listName, index)}
                      autoFocus
                    />
                    <div className="crud-item-actions">
                      <button
                        type="button"
                        className="crud-action-btn save"
                        onClick={() => onUpdateItem(listName, index)}
                        title="Save changes"
                      >
                        ✓
                      </button>
                      <button
                        type="button"
                        className="crud-action-btn cancel"
                        onClick={() => onCancelEdit(listName)}
                        title="Cancel"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="crud-item-content">
                      <span className="crud-item-text">{getItemValue(item)}</span>
                    </div>
                    <div className="crud-item-actions">
                      <button
                        type="button"
                        className="crud-action-btn edit"
                        onClick={() => onStartEdit(listName, index, getItemValue(item))}
                        title="Edit item"
                      >
                        ✎
                      </button>
                      <button
                        type="button"
                        className="crud-action-btn delete"
                        onClick={() => onDelete(listName, index)}
                        title="Delete item"
                      >
                        🗑
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
