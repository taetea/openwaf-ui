import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {PolicyClass} from "../policy.class";
import {PolicyService} from "../policy.service";

@Component({
    selector: 'app-antilink',
    templateUrl: './antilink.component.html',
    styleUrls: ['./antilink.component.css']
})
export class AntilinkComponent implements OnInit {
    exclude: any;
    entry: any;
    _id: string;
    datas: PolicyClass = new PolicyClass();
    i = new Date().getTime();
    headers: any = [];
    mode_list = [
        {'name': 'Referer', 'value': 'referer'},
        {'name': 'Cookie', 'value': 'cookie'},
    ];
    ant_action_list = [
        {'name': '拦截并发送响应码', 'value': 'deny'},
        {'name': '重定向', 'value': 'redirect'},
        {'name': '连接重置', 'value': 'reset_connection'},
        {'name': '放行', 'value': 'pass'},
    ];
    codeList = [
        {value: "400", text: "400"},
        {value: "401", text: "401"},
        {value: "403", text: "403"},
        {value: "404", text: "404"},
        {value: "405", text: "405"},
        {value: "410", text: "410"},
        {value: "500", text: "500"},
        {value: "501", text: "501"},
        {value: "503", text: "503"},
        {value: "504", text: "504"}
    ];
  constructor(
    private _router: Router,
    private _service: PolicyService,
    private _activatedRoute: ActivatedRoute) {
  }

    ngOnInit() {
        // 初始化表单数据
        this._activatedRoute.params.subscribe((params) => {
            this._id = params['_id'];
            if (this._id) {
                this._service.getPolicy(this._id).subscribe(data => {
                    this.datas.config = data['result'];
                    if (JSON.stringify(this.datas.config.twaf_anti_hotlink.exclude) !== '{}') {
                      this.exclude = this.datas.config.twaf_anti_hotlink.exclude.join('\n');
                    }
                    if (JSON.stringify(this.datas.config.twaf_anti_hotlink.entry) !== '{}') {
                      this.entry = this.datas.config.twaf_anti_hotlink.entry.join('\n');
                    }
                })
            }
        });
    }

    setState(value) {
        this.datas.config.twaf_anti_hotlink.state = value;
    }

    submit(form) {
        const that = this;
        if (this.exclude) {
            this.datas.config.twaf_anti_hotlink.exclude = this.exclude.split('\n');
        } else {
            this.datas.config.twaf_anti_hotlink.exclude = [];
        }
        if (this.entry) {
            this.datas.config.twaf_anti_hotlink.entry = this.entry.split('\n');
        } else {
            this.datas.config.twaf_anti_hotlink.entry = [];
        }
        this._service.setPolicy(this._id, this.datas).subscribe(
            res => {
                if (res['success']) {
                    // this.toastr.success('编辑成功！', '');
                    // 延迟1s 后跳转至列表页面
                    setTimeout(function () {
                        that._router.navigate(['pages', 'policy']); // 为什么用that ： this容易找不到指代的是谁
                    }, '1000');
                } else {
                    // this.toastr.error('编辑失败！', '');
                }
            },
            error => {
                // this.toastr.error('编辑失败！', '');
            }
        )
    }

}
