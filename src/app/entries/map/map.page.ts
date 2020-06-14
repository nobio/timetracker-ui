import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { TimeEntriesService } from 'src/app/service/datasource/time-entries.service';
import {} from 'google-maps';

@Component({
  selector: 'google-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  private map: google.maps.Map;

  constructor(
    public timeEntryService: TimeEntriesService,
  ) { }

  ngOnInit() {
    this.initMap();
  }
  ionViewDidLoad(){
    this.initMap();
  }

  initMap(): void {
    const coords = new google.maps.LatLng(
      this.timeEntryService.selectedEntry.latitude,
      this.timeEntryService.selectedEntry.longitude
    );

    const mapOptions: google.maps.MapOptions = {
      center: coords,
      zoom: 18,
      tilt: 45,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      rotateControl: true
    }

    this.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    const marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    // workaround: reload map after 500ms otherwise the canvas remains empty
    setTimeout(() => {
//      this.map.panBy(0, 0);
      this.map.setZoom(this.map.getZoom());  
//      google.maps.event.trigger(this.map, 'resize');
    }, 500)
     
  }
}
