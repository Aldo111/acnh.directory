import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-directory',
  templateUrl: './directory.component.html',
  styleUrls: ['./directory.component.css']
})
export class DirectoryComponent implements OnInit {
  constructor(private httpService: HttpClient){ }

  // Set up dropdown filter variables:
  dropdownSettings: IDropdownSettings;
  langForm = new FormGroup({
    lang: new FormControl()
  });
  dropdownListPlatforms = [];
  dropdownListInformation = [];
  dropdownListTools = [];

  selectedItemsPlatforms = [];
  selectedItemsInformation = [];
  selectedItemsTools = [];

  projects = [];
  filterData = [];
  ifFilterMeetsAll = false;

  ngOnInit() {
    this.httpService.get(environment.projectData).subscribe(
      data => {
        // Set projects and filterData arrays to project data:
        this.projects = data as string [];
        this.filterData = data as string [];

        this.applyFilters();
      },
      (err: HttpErrorResponse) => {
        console.log (err.message);
      }
    );

    // Set default value to English and filter:
    this.langForm.patchValue({ lang: 'en', tc: true });

    // Set filter dropdown values:
    this.dropdownListPlatforms = [
      { item_id: 'website', item_text: 'Website' },
      { item_id: 'android', item_text: 'Android' },
      { item_id: 'ios', item_text: 'iOS' }
    ];
    this.dropdownListInformation = [
      { item_id: 'art', item_text: 'Art' },
      { item_id: 'critters', item_text: 'Critters' },
      { item_id: 'flowers', item_text: 'Flowers' },
      { item_id: 'fossils', item_text: 'Fossils' },
      { item_id: 'gameplay', item_text: 'Gameplay' },
      { item_id: 'items', item_text: 'Items' },
      { item_id: 'gifts', item_text: 'Villager Gifts' },
      { item_id: 'villagers', item_text: 'Villagers' }
    ];
    this.dropdownListTools = [
      { item_id: 'api', item_text: 'API' },
      { item_id: 'checklist', item_text: 'Checklist' },
      { item_id: 'design sharing', item_text: 'Design Sharing' },
      { item_id: 'dreams', item_text: 'Dream Sharing' },
      { item_id: 'island rating', item_text: 'Island Rating Calc' },
      { item_id: 'marketplace', item_text: 'Marketplace' },
      { item_id: 'music', item_text: 'Music Player' },
      { item_id: 'queueing', item_text: 'Queueing' },
      { item_id: 'simulator', item_text: 'Simulator' },
      { item_id: 'town tunes', item_text: 'Town Tunes' },
      { item_id: 'turnips', item_text: 'Turnip Pricing' },
      { item_id: 'weather', item_text: 'Weather Forecast' },
      { item_id: 'wiki', item_text: 'Wiki' }
    ];

    // Dropdown settings:
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      itemsShowLimit: 3,
      allowSearchFilter: false,
      enableCheckAll: false
    };
  }

  scrollToTop() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0;
  }

  resetFilters() {
    this.selectedItemsPlatforms = [];
    this.selectedItemsInformation = [];
    this.selectedItemsTools = [];

    this.applyFilters();
  }

  applyFilters() {
    const selectedItemsPlatforms = [];
    for (const platform of this.selectedItemsPlatforms) {
      selectedItemsPlatforms.push(platform.item_id);
    }

    const selectedItemsInformation = [];
    for (const info of this.selectedItemsInformation) {
      selectedItemsInformation.push(info.item_id);
    }

    const selectedItemsTools = [];
    for (const tool of this.selectedItemsTools) {
      selectedItemsTools.push(tool.item_id);
    }

    this.projects = this.filterData.filter(item => {
      const platforms = [];
      if (item.site !== '') {
        platforms.push('website');
      }
      if (item.android !== '') {
        platforms.push('android');
      }
      if (item.ios !== '') {
        platforms.push('ios');
      }

      const totalLength = this.selectedItemsPlatforms.length + this.selectedItemsInformation.length + this.selectedItemsTools.length;
      if (this.ifFilterMeetsAll) {
        return (!totalLength || (
          (!selectedItemsPlatforms.length || selectedItemsPlatforms.every(p => platforms.includes(p)))
          && (!selectedItemsInformation.length || selectedItemsInformation.every(c => item.information.includes(c)))
          && (!selectedItemsTools.length || selectedItemsTools.every(c => item.tools.includes(c)))))
          && item.languages.includes(this.langForm.get('lang').value);
      } else {
        return (!totalLength || (
            (!selectedItemsPlatforms.length || selectedItemsPlatforms.some(p => platforms.includes(p)))
            && (!selectedItemsInformation.length || selectedItemsInformation.some(c => item.information.includes(c)))
            && (!selectedItemsTools.length || selectedItemsTools.some(c => item.tools.includes(c)))))
            && item.languages.includes(this.langForm.get('lang').value);
      }
    });
  }

  singleInformationFilter(selection) {
    this.selectedItemsPlatforms = [];
    this.selectedItemsInformation = [this.dropdownListInformation.filter(obj => obj.item_id === selection)[0]];
    this.selectedItemsTools = [];
    const categories = [selection];

    this.projects = this.filterData.filter(item => {
      const cats = item.information.concat(item.tools);

      if (this.ifFilterMeetsAll) {
        return ((categories.length === 0 ||
          categories.every(c => cats.includes(c))) && item.languages.includes(this.langForm.get('lang').value));
      } else {
        return ((categories.length === 0 ||
          categories.some(c => cats.indexOf(c) >= 0)) && item.languages.includes(this.langForm.get('lang').value));
      }
    });

    this.scrollToTop();
  }

  singleFeatureFilter(selection) {
    this.selectedItemsPlatforms = [];
    this.selectedItemsInformation = [];
    this.selectedItemsTools = [this.dropdownListTools.filter(obj => obj.item_id === selection)[0]];
    const categories = [selection];

    this.projects = this.filterData.filter(item => {
      const cats = item.information.concat(item.tools);

      if (this.ifFilterMeetsAll) {
        return ((categories.length === 0 ||
          categories.every(c => cats.includes(c))) && item.languages.includes(this.langForm.get('lang').value));
      } else {
        return ((categories.length === 0 ||
          categories.some(c => cats.indexOf(c) >= 0)) && item.languages.includes(this.langForm.get('lang').value));
      }
    });

    this.scrollToTop();
  }

  filterToggle(event) {
    if (event.target.checked) {
      this.ifFilterMeetsAll = true;
    } else {
      this.ifFilterMeetsAll = false;
    }

    this.applyFilters();
  }
}
