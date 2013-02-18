$(function() {
  var Document = Spine.Model.sub();

  Document.configure("Document", "name", "content");

  Document.extend(Spine.Model.Local);

  Document.extend({
  });


  var DocumentView = Spine.Controller.sub({
    init: function() {
      this.item.bind("update", this.proxy(this.render));
      this.item.bind("destroy", this.proxy(this.remove));
    },
    template: function(items) {
      return $("#documentTemplate").tmpl(items);
    },
    render: function() {
      $("section").html(this.template(this.item));
      return this;
    },
  });

  var DocumentListView = Spine.Controller.sub({
    tag: "li",
    events: {
      "click .open-document": "open"
    },
    init: function() {
      this.item.bind("update", this.proxy(this.render));
      this.item.bind("destroy", this.proxy(this.remove));
    },
    template: function(items) {
      return $("#documentListTemplate").tmpl(items);
    },
    render: function() {
      this.el.html(this.template(this.item));
      return this;
    },
    remove: function() {
      this.el.remove();
    },
    open: function(e) {
      Spine.Route.navigate("/document", this.item.id);
    }
  });


  var FileList = Spine.Controller.sub({
    events: {
      "click .add-file": "addFile"
    },
    el: $("aside"),
    init: function() {
      Document.bind("refresh change", this.proxy(this.render));
      Document.fetch();
    },
    render: function() {
      var documents = Document.all();
      this.el.find("ul").remove();
      var list = $("<ul />");
      for(var i = 0, l = documents.length; i < l; i++) {
        list.append(new DocumentListView({
          item: documents[i]
        }).render().el);
      }
      this.el.prepend(list);
      return this;
    },
    addFile: function(e) {
      e.preventDefault();
      var value = $("input.file-name").val();
      $("input.file-name").val("");
      Document.create({name: value, content: ""});
    }
  });


  var App = Spine.Controller.sub({
    el: $("body"),
    init: function() {
      this.file_list = new FileList(); /*{
        el: $("aside")
      });*/
      this.routes({
        "/": function(){
        },
        "/document/:id": function(params) {
          var doc = Document.find(params.id)
          new DocumentView({item: doc}).render();
        }
      });
    },
    render: function() {
      this.file_list.render();
      return this;
    }
  });

  var app = new App({
    el: $("body")
  });

  Spine.Route.setup();
});
