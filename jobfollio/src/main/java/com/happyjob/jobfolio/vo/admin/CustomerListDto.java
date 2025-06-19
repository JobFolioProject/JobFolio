package com.happyjob.jobfolio.vo.admin;

import com.happyjob.jobfolio.vo.usermgr.UserModel;

import java.util.List;

public class CustomerListDto {
    private List<UserModel> customers; // 페이지네이션된 고객 목록
    private int totalCount;           // 검색/필터링 조건에 맞는 전체 고객 수

    public CustomerListDto() {
    }

    public CustomerListDto(List<UserModel> customers, int totalCount) {
        this.customers = customers;
        this.totalCount = totalCount;
    }

    public List<UserModel> getCustomers() {
        return customers;
    }

    public void setCustomers(List<UserModel> customers) {
        this.customers = customers;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    @Override
    public String toString() {
        return "CustomerListDto{" +
                "customers=" + customers +
                ", totalCount=" + totalCount +
                '}';
    }
}
