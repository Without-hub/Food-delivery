Component({
  properties: {
    shop: { type: Object, value: {} }
  },
  methods: {
    onTap() {
      this.triggerEvent('tap', { id: this.data.shop.id });
    }
  }
});
