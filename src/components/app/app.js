import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import ItemAddForm from '../item-add-form';

import './app.css';

export default class App extends Component {
  maxId = 10;
  createTodoItem = ( label ) => {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  };

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch'),
    ],
    term: '',
    filter: 'all'
  };

  addItem = (text) => {
    this.setState(({ todoData }) => {
      const newItem = this.createTodoItem(text);
      const newArr = [...todoData, newItem];
      return {
        todoData: newArr
      }
    })
  };

  deleteItem = (id) => {
    this.setState( ({ todoData }) => {
      const idx = todoData.findIndex((el) => el.id === id);
      const newArray = [
        ...todoData.slice(0, idx),
        ...todoData.slice(idx+1)
      ];
      return {
        todoData: newArray
      }
    })
  };

  toggleProperty = (arr, id, propertyName) => {
    const idx = arr.findIndex((el) => el.id === id);
    const oldItem = arr[idx];
    const newItem = { ...oldItem, [propertyName]: !oldItem[propertyName] };
    return [
      ...arr.slice(0, idx),
      newItem,
      ...arr.slice(idx+1)
    ];
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    });
  };

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    });
  };

  search (items, term) {
    if(term.length === 0) {
      return items;
    }
    return items.filter( (item) =>  {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    });
  };

  onSearchChange = (term) => {
    this.setState({ term })
  };

  onFilterChange = ( filter ) => {
    this.setState({ filter })
  };
  filterItems (items, filter) {
    if(filter === 'all') {
      return items;
    } else if(filter === 'active') {
      return items.filter(item => !item.done)
    } else if (filter === 'done') {
      return items.filter(item => item.done)
    }
  };

  render() {
    const { todoData, term, filter } = this.state;
    const doneCount = todoData.filter(( el ) => el.done).length;
    const todoCount = todoData.length - doneCount;
    const visibleItems = this.search(this.filterItems(todoData, filter), term);
    return (
      <div className="todo-app">
        <AppHeader toDo={ todoCount } done={ doneCount }/>
        <div className="top-panel d-flex">
          <SearchPanel onSearchChange={ this.onSearchChange }/>
          <ItemStatusFilter onFilterChange={ this.onFilterChange } filter={ filter }/>
        </div>

        <TodoList todos={ visibleItems }
                  onDeleted={ this.deleteItem }
                  onToggleImportant={ this.onToggleImportant }
                  onToggleDone={ this.onToggleDone }/>
        <ItemAddForm onItemAdded={ this.addItem }/>
      </div>
    );
  }
};
