<template>
  <v-card variant="outlined" :loading="loading">
    <v-card-title
      class="d-flex align-center"
      @click="toggleExpanded"
      style="cursor: pointer"
      v-ripple
    >
      <v-icon start>mdi-cellphone-cog</v-icon>
      {{ $t("options.title") }}

      <v-spacer></v-spacer>
      <v-btn
        size="small"
        icon
        :disabled="loading"
        variant="tonal"
        @click.stop="toggleExpanded"
        :style="{ transform: expanded ? 'rotate(180deg)' : '' }"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text v-if="expanded">
      <v-alert v-if="error" type="error" class="mb-3">
        {{ error }}
      </v-alert>

      <v-form v-model="valid">
        <div class="d-flex align-center gap-4 flex-wrap">
          <v-checkbox
            class="flex-grow-0 flex-shrink-0"
            v-model="optionsData.rejectCall"
            :disabled="loading"
            :label="$t('options.rejectCall')"
            hide-details
            density="compact"
          ></v-checkbox>
          <v-text-field
            class="flex-grow-1 flex-shrink-0"
            v-model="optionsData.msgCall"
            :disabled="loading || !optionsData.rejectCall"
            :label="$t('options.msgCall')"
            hide-details
            style="min-width: 200px"
          ></v-text-field>
        </div>
        <div class="d-flex gap-x-4 flex-wrap">
          <v-checkbox
            class="flex-grow-0"
            v-model="optionsData.groupsIgnore"
            :disabled="loading"
            :label="$t('options.groupsIgnore')"
            hide-details
            density="compact"
          ></v-checkbox>

          <v-checkbox
            class="flex-grow-0"
            v-model="optionsData.alwaysOnline"
            :disabled="loading"
            :label="$t('options.alwaysOnline')"
            hide-details
            density="compact"
          ></v-checkbox>

          <v-checkbox
            class="flex-grow-0"
            v-model="optionsData.readMessages"
            :disabled="loading"
            :label="$t('options.readMessages')"
            hide-details
            density="compact"
          ></v-checkbox>

          <v-checkbox
            class="flex-grow-0"
            v-model="optionsData.readStatus"
            :disabled="loading"
            :label="$t('options.readStatus')"
            hide-details
            density="compact"
          ></v-checkbox>
          <v-checkbox
            class="flex-grow-0"
            v-model="optionsData.syncFullHistory"
            :disabled="loading"
            :label="$t('options.syncFullHistory')"
            hide-details
            density="compact"
          ></v-checkbox>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions v-if="expanded">
      <v-spacer></v-spacer>
      <v-btn
        :disabled="
          !valid ||
          JSON.stringify(optionsData) === JSON.stringify(defaultOptionsData)
        "
        :loading="loading"
        color="primary"
        @click="saveOptions"
        variant="tonal"
      >
        {{ $t("save") }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import instanceController from "@/services/instanceController";

const defaultOptions = () => ({
  rejectCall: false,
  msgCall: "",
  groupsIgnore: true,
  alwaysOnline: false,
  readMessages: false,
  readStatu: false,
  syncFullHistory: false
});

export default {
  name: "InstanceOptions",
  props: {
    instance: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
    expanded: false,
    loading: false,
    error: false,
    valid: false,
    optionsData: {
      rejectCall: false,
      msgCall: "",
      groupsIgnore: false,
      alwaysOnline: false,
      readMessages: false,
      readStatu: false,
      syncFullHistory: false
    },
    defaultOptionsData: {
      rejectCall: false,
      msgCall: "",
      groupsIgnore: false,
      alwaysOnline: false,
      readMessages: false,
      readStatu: false,
      syncFullHistory: false
    },
  }),

  methods: {
    toggleExpanded() {
      if (this.loading) return;
      this.expanded = !this.expanded;
    },
    async saveOptions() {
      try {
        this.loading = true;
        this.error = false;
        await instanceController.options.set(
          this.instance.name,
          this.optionsData
        );
        this.defaultOptionsData = Object.assign(
          defaultOptions(),
          this.optionsData
        );
      } catch (e) {
        this.error = e.message?.message || e.message || e;
      } finally {
        this.loading = false;
      }
    },

    async loadOptions() {
      try {
        this.loading = true;
        this.error = false;
        const optionsData = await instanceController.options.get(
          this.instance.name
        );

        this.optionsData = Object.assign(defaultOptions(), optionsData);
        this.defaultOptionsData = Object.assign(defaultOptions(), optionsData);
      } catch (e) {
        this.error = e.message?.message || e.message || e;
      } finally {
        this.loading = false;
      }
    },
  },

  watch: {
    expanded(val) {
      if (val) this.loadOptions();
    },
  },
};
</script>

<style></style>
