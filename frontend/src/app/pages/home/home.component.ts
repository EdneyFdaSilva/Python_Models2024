import { Component, OnInit } from "@angular/core";
import jwt_decode from "jwt-decode";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit {
  constructor() {}

  public name: string;

  ngOnInit() {
    let token = localStorage.getItem("access_token");
    let decoded = jwt_decode(token);
    this.name = decoded["Name"];
  }
}
