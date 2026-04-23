import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FilterField, FilterLayout } from '../../interface/filter-interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-card.html',
  styleUrl: './filter-card.css',
})
export class FilterCard implements OnInit {
  @Input() title: string = 'Filters';
  @Input() fields: FilterField[] = [];

  // Default interface for layout
  @Input() layout: FilterLayout = {
    desktopCols: 4,
    gap: 4
  };

  @Output() onFilter = new EventEmitter<any>();
  @Output() onReset = new EventEmitter<void>();

  filterData: any = {};

  ngOnInit(): void {
    this.resetModel(false);
  }

  /**
   * Clears all inputs and optionally notifies parent
   * @param emit boolean - if true, triggers events to parent
   */
  
  resetModel(emit: boolean = true) {
    this.fields.forEach(field => {
      this.filterData[field.key] = '';
    });

    if (emit) {
      this.onReset.emit();
      // We send empty data to reload the full list
      this.onFilter.emit({ ...this.filterData });
    }
  }

  /**
   * Called when the 'Filter' button is clicked
   */
  applyFilter() {
    // We send a shallow copy to ensure the parent gets a clean object
    this.onFilter.emit({ ...this.filterData });
  }
}
